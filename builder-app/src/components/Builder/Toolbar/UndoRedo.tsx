import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useHistoryStore } from '@/store/historyStore';
import { useBuilderStore } from '@/store/builderStore';

export const UndoRedo: React.FC = () => {
  const { canUndo, canRedo, undo, redo } = useHistoryStore();
  const { setConfig } = useBuilderStore();

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setConfig(previousState);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setConfig(nextState);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUndo}
        disabled={!canUndo}
        icon={<Undo className="h-4 w-4" />}
        title="Undo (Ctrl+Z)"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRedo}
        disabled={!canRedo}
        icon={<Redo className="h-4 w-4" />}
        title="Redo (Ctrl+Y)"
      />
    </div>
  );
};
