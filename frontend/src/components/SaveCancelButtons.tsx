/**
 * SaveCancelButtons Component
 *
 * Reusable save and cancel buttons for forms and edit modes.
 * Save button uses light blue (accent-blue), Cancel button uses red (matching cancel lesson button).
 *
 * @example
 * // For forms with onSubmit handler:
 * <SaveCancelButtons
 *   onSave={() => {}}
 *   onCancel={() => setEditMode(false)}
 *   isSaving={saving}
 *   saveType="submit"
 * />
 *
 * @example
 * // For direct save actions:
 * <SaveCancelButtons
 *   onSave={handleSave}
 *   onCancel={() => setEditMode(false)}
 *   isSaving={saving}
 *   saveType="button"
 * />
 */

interface SaveCancelButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveText?: string;
  cancelText?: string;
  disabled?: boolean;
  saveType?: "button" | "submit";
}

export default function SaveCancelButtons({
  onSave,
  onCancel,
  isSaving = false,
  saveText = "Save",
  cancelText = "Cancel",
  disabled = false,
  saveType = "button",
}: SaveCancelButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        type={saveType}
        onClick={saveType === "button" ? onSave : undefined}
        disabled={disabled || isSaving}
        className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-accent-blue-dark text-white hover:bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed flex-1">
        {isSaving ? "Saving..." : saveText}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled || isSaving}
        className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1">
        {cancelText}
      </button>
    </div>
  );
}
