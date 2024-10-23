import React from 'react';
import { Send, Trash2, Save } from 'lucide-react';

interface ExamListControlsProps {
  onSendList: () => void;
  onClearList: () => void;
  onSaveDraft: () => void;
  isSending: boolean;
}

const ExamListControls: React.FC<ExamListControlsProps> = ({
  onSendList,
  onClearList,
  onSaveDraft,
  isSending,
}) => {
  return (
    <div className="flex space-x-2 mt-4">
      <button
        onClick={onSendList}
        disabled={isSending}
        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-700 disabled:opacity-50"
      >
        <Send className="h-5 w-5 mr-2" />
        {isSending ? 'Gönderiliyor...' : 'Listeyi Gönder'}
      </button>
      <button
        onClick={onSaveDraft}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700"
      >
        <Save className="h-5 w-5 mr-2" />
        Taslak Kaydet
      </button>
      <button
        onClick={onClearList}
        className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-red-700"
      >
        <Trash2 className="h-5 w-5 mr-2" />
        Listeyi Temizle
      </button>
    </div>
  );
};

export default ExamListControls;