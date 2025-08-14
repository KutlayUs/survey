import React, { useState } from 'react';
import { Survey } from '../types';
import { Button, Card } from './ui';
import { storageService } from '../services/storageService';

interface RunnerProps {
  survey: Survey;
  onFinish: () => void;
}

export const Runner: React.FC<RunnerProps> = ({ survey, onFinish }) => {
  const nodes = Object.values(survey.schema.drawflow.Home.data || {});
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveResponse(survey.id, answers);
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">{survey.title}</h1>
      {nodes.map((node: any) => (
        <Card key={node.id} className="space-y-2">
          <label className="font-semibold block">{node.data?.question || 'Question'}</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={answers[node.id] || ''}
            onChange={e => handleChange(String(node.id), e.target.value)}
            required
          />
        </Card>
      ))}
      <div className="text-center pt-4">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

