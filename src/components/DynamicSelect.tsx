import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DynamicSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DynamicSelect = ({ options, value, onChange, placeholder }: DynamicSelectProps) => {
  const [showCustom, setShowCustom] = useState(false);

  const handleChange = (val: string) => {
    if (val === "__other__") {
      setShowCustom(true);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      <Select value={showCustom ? "__other__" : value} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
          <SelectItem value="__other__">Other</SelectItem>
        </SelectContent>
      </Select>
      {showCustom && (
        <Input
          placeholder="Specify..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="animate-fade-in"
        />
      )}
    </div>
  );
};

export default DynamicSelect;
