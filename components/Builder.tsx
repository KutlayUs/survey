import React, { useState } from 'react';
import { Survey, DrawflowData } from '../types';
import { Button, Card } from './ui';

interface BuilderProps {
  survey: Survey;
  onSave: (schema: DrawflowData) => void;
  onSaveAndClose: (schema: DrawflowData) => void;
}

export const Builder: React.FC<BuilderProps> = ({ survey, onSave, onSaveAndClose }) => {
  const [schemaText, setSchemaText] = useState<string>(JSON.stringify(survey.schema, null, 2));

  const parseSchema = (): DrawflowData | null => {
    try {
      return JSON.parse(schemaText);
    } catch {
      alert('Invalid schema JSON');
      return null;
    }
  };

  const handleSave = () => {
    const schema = parseSchema();
    if (schema) onSave(schema);
  };

  const handleSaveClose = () => {
    const schema = parseSchema();
    if (schema) onSaveAndClose(schema);
  };

  return (
    <div className="p-4 flex-1 overflow-auto">
      <Card>
        <textarea
          className="w-full h-64 font-mono text-sm border rounded p-2"
          value={schemaText}
          onChange={e => setSchemaText(e.target.value)}
        />
      </Card>
      <div className="mt-4 flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleSaveClose}>Save & Close</Button>
      </div>
    </div>
  );
};

