
import { useState } from "react";

export const ControlUploadForm = () => {

  const [controlId, setControlId] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ controlId: '', description: '' });

  const validateControlId = (value: string) => {
    const controlIdRegex = /^CTRL-\d{3}$/;

    if (!value.trim()){
      return 'Control ID is required';
    }
    if (!controlIdRegex.test(value)){
      return 'Format must be CTRL-XXX';
    }
    return '';
  };

  const validateDescription = (value: string) => {
    const valueLength = value.trim().length;
    const descriptionRegex = /[<>{}[\]]/
    if (!value.trim()){
      return 'Description is required';
    }
    if (valueLength < 10 || valueLength > 500){
      return 'Description must be 10-500 characters long';
    }
    if (descriptionRegex.test(value)){
      return 'Description cannot contain HTML or script tags';
    }
    return '';
  };

  const validateForm = () => {
    const controlIdError = validateControlId(controlId);
    const descriptionError = validateDescription(description);
    setErrors({controlId: controlIdError, description: descriptionError});
    return !controlIdError && !descriptionError;
  };

  const handleOnChangeControlId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setControlId(value);
    setErrors({ ...errors, controlId: validateControlId(value) });
  };

  const handleOnBlurControlId = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrors({ ...errors, controlId: validateControlId(value) });
  }

  const handleOnChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setErrors({ ...errors, description: validateDescription(value) });
  };

  const handleOnBlurDescription = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setErrors({ ...errors, description: validateDescription(value) });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(validateForm()){
      alert(`${controlId} successfully submitted`);
    }
  };

  return(
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
      <div className="flex flex-col items-center w-80 p-6 rounded-lg bg-gray-200">
        <h2 className="text-xl text-center">Control Framework Upload</h2>
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col items-center gap-2"
        >
          <div className="flex flex-col text-center">
            <label>Control ID</label>
            <input
              type='text'
              value={controlId}
              placeholder="e.g., CTRL-001"
              onChange={handleOnChangeControlId}
              onBlur={handleOnBlurControlId}
              className="bg-white mt-2 rounded-md p-2"
            />
            <div className="min-h-8">
              {errors.controlId && <p className="text-red-500 text-sm mt-2 text-center">{errors.controlId}</p>}
            </div>
          </div>
          <div className="flex flex-col text-center min-w-64">
            <label>Description</label>
            <textarea
              value={description}
              placeholder='e.g., implement multi-factor authentication'
              onChange={handleOnChangeDescription}
              onBlur={handleOnBlurDescription}
              rows={4}
              maxLength={500}
              className="bg-white p-2 rounded-md mt-2"
            />
            <div className="min-h-8">
              {errors.description && <p className="text-red-500 text-sm mt-2 text-center">{errors.description}</p>}
            </div>
          </div>
            <button
              type='submit'
              disabled={!controlId || !description || !!errors.controlId || !!errors.description}
              className="bg-blue-300 px-6 py-3 rounded-lg hover:bg-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
              Submit
            </button>
        </form>
      </div>
    </div>
  );
}
