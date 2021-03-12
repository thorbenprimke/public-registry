import React, { FC, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
    NativeSyntheticEvent, Text, TextInput, TextInputSelectionChangeEventData, View
} from 'react-native';

import { MentionInputProps, MentionPartType, Suggestion } from '../types';
import {
    defaultMentionTextStyle, generateValueFromPartsAndChangedText, generateValueWithAddedSuggestion,
    getMentionPartSuggestionKeywords, isMentionPartType, parseValue
} from '../utils';

const MentionInput: FC<MentionInputProps> = ({
  value,
  onChange,

  partTypes = [],

  inputRef: propInputRef,

  containerStyle,

  onSelectionChange,

  onRenderSuggestions = null,

  showSuggestions = true,

  lastSelectedSuggestion = null,

  ...textInputProps
}) => {
  const textInput = useRef<TextInput | null>(null);

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const { plainText, parts } = useMemo(() => parseValue(value, partTypes), [
    value,
    partTypes,
  ]);

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    setSelection(event.nativeEvent.selection);

    onSelectionChange && onSelectionChange(event);
  };

  /**
   * Callback that trigger on TextInput text change
   *
   * @param changedText
   */
  const onChangeInput = (changedText: string) => {
    onChange(
      generateValueFromPartsAndChangedText(parts, plainText, changedText)
    );
  };

  /**
   * We memoize the keyword to know should we show mention suggestions or not
   */
  const keywordByTrigger = useMemo(() => {
    return getMentionPartSuggestionKeywords(
      parts,
      plainText,
      selection,
      partTypes
    );
  }, [parts, plainText, selection, partTypes]);

  /**
   * Callback on mention suggestion press. We should:
   * - Get updated value
   * - Trigger onChange callback with new value
   */
  const onSuggestionPress = (mentionType: MentionPartType) => (
    suggestion: Suggestion
  ) => {
    const newValue = generateValueWithAddedSuggestion(
      parts,
      mentionType,
      plainText,
      selection,
      suggestion
    );

    if (!newValue) {
      return;
    }

    onChange(newValue);

    /**
     * Move cursor to the end of just added mention starting from trigger string and including:
     * - Length of trigger string
     * - Length of mention name
     * - Length of space after mention (1)
     *
     * Not working now due to the RN bug
     */
    // const newCursorPosition = currentPart.position.start + triggerPartIndex + trigger.length +
    // suggestion.name.length + 1;

    // textInput.current?.setNativeProps({selection: {start: newCursorPosition, end: newCursorPosition}});
  };

  useEffect(() => {
    console.log("lastSelectedSuggestion changed: ", lastSelectedSuggestion);
    if (
      lastSelectedSuggestion === undefined ||
      lastSelectedSuggestion === null
    ) {
      return;
    }
    onSuggestionPress(lastSelectedSuggestion.mentionType)(
      lastSelectedSuggestion.suggestion
    );
  }, [lastSelectedSuggestion && lastSelectedSuggestion.suggestion.id]);

  const handleTextInputRef = (ref: TextInput) => {
    textInput.current = ref as TextInput;

    if (propInputRef) {
      if (typeof propInputRef === "function") {
        propInputRef(ref);
      } else {
        (propInputRef as MutableRefObject<TextInput>).current = ref as TextInput;
      }
    }
  };

  const renderMentionSuggestions = (mentionType: MentionPartType) => (
    <React.Fragment key={mentionType.trigger}>
      {mentionType.renderSuggestions &&
        mentionType.renderSuggestions({
          keyword: keywordByTrigger[mentionType.trigger],
          onSuggestionPress: onSuggestionPress(mentionType),
        })}
    </React.Fragment>
  );

  const renderMentionSuggestionsForEvent = (mentionType: MentionPartType) => {
    return (
      keywordByTrigger[mentionType.trigger] !== undefined && {
        mentionType,
        keyword: keywordByTrigger[mentionType.trigger],
        // onSuggestionPress: onSuggestionPress(mentionType),
      }
    );
  };

  const toShow = (partTypes.filter(
    (one) =>
      isMentionPartType(one) &&
      one.renderSuggestions != null &&
      !one.isBottomMentionSuggestionsRender
  ) as MentionPartType[])
    .map(renderMentionSuggestionsForEvent)
    .filter((n) => n) as { keyword: string }[];
  const hasItemToShow = toShow.length > 0;
  const keyword = toShow && toShow.length > 0 && toShow[0].keyword;

  useEffect(() => {
    if (onRenderSuggestions) {
      onRenderSuggestions(toShow);
    }
  }, [keyword]);

  return (
    <View style={containerStyle}>
      {(partTypes.filter(
        (one) =>
          isMentionPartType(one) &&
          showSuggestions &&
          one.renderSuggestions != null &&
          !one.isBottomMentionSuggestionsRender
      ) as MentionPartType[]).map(renderMentionSuggestions)}

      <TextInput
        multiline
        {...textInputProps}
        ref={handleTextInputRef}
        onChangeText={onChangeInput}
        onSelectionChange={handleSelectionChange}
      >
        <Text>
          {parts.map(({ text, partType, data }, index) =>
            partType ? (
              <Text
                key={`${index}-${data?.trigger ?? "pattern"}`}
                style={partType.textStyle ?? defaultMentionTextStyle}
              >
                {text}
              </Text>
            ) : (
              <Text key={index}>{text}</Text>
            )
          )}
        </Text>
      </TextInput>

      {(partTypes.filter(
        (one) =>
          isMentionPartType(one) &&
          showSuggestions &&
          one.renderSuggestions != null &&
          one.isBottomMentionSuggestionsRender
      ) as MentionPartType[]).map(renderMentionSuggestions)}
    </View>
  );
};

export { MentionInput };
