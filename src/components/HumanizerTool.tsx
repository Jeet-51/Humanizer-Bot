import { useEffect } from "react";
import { InputSection } from "@/components/humanizer/InputSection";
import { OutputSection } from "@/components/humanizer/OutputSection";
import { AIScoreMeter } from "@/components/humanizer/AIScoreMeter";
import { DiffView } from "@/components/humanizer/DiffView";
import { useHumanizerForm } from "@/hooks/useHumanizerForm";

interface HumanizerToolProps {
  initialText?: string;
  initialHumanizedText?: string;
}

export function HumanizerTool({ initialText = "", initialHumanizedText = "" }: HumanizerToolProps) {
  const {
    inputText,
    setInputText,
    outputText,
    readability,
    setReadability,
    purpose,
    setPurpose,
    strength,
    setStrength,
    isHumanizing,
    handleHumanize
  } = useHumanizerForm({ initialText, initialHumanizedText });

  const showResults = !!inputText && !!outputText;

  return (
    <div className="space-y-6">
      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InputSection
          inputText={inputText}
          setInputText={setInputText}
          handleHumanize={handleHumanize}
          readability={readability}
          setReadability={setReadability}
          purpose={purpose}
          setPurpose={setPurpose}
          strength={strength}
          setStrength={setStrength}
          isHumanizing={isHumanizing}
        />
        <OutputSection
          outputText={outputText}
          isHumanizing={isHumanizing}
        />
      </div>

      {/* AI Detection Score — only shown after humanization */}
      {showResults && (
        <AIScoreMeter
          originalText={inputText}
          humanizedText={outputText}
        />
      )}

      {/* Diff View — only shown after humanization */}
      {showResults && (
        <DiffView
          originalText={inputText}
          humanizedText={outputText}
        />
      )}
    </div>
  );
}
