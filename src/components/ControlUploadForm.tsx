
import { useState } from "react";

export const ControlUploadForm = () => {

  const [controlId, setControlId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ controlId: '', category: '', description: '' });

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

  const validateCategory = (value: string) => {
    const validCategories = ['Access Control', 'Data Protection', 'Monitoring'];
    if (!value.trim()){
      return 'Category is required';
    }
    if (!validCategories.includes(value)){
      return 'Invalid category';
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
    const categoryError = validateCategory(category);
    setErrors({controlId: controlIdError, category: categoryError, description: descriptionError});
    return !controlIdError && !categoryError && !descriptionError;
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

  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    setErrors({...errors, category: validateCategory(value)});
  };

  const handleOnBlurCategory = (e: React.FocusEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setErrors({...errors, category: validateCategory(value)});
  };

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
      alert(`Control ID: ${controlId}\nCategory: ${category}\nDescription: ${description}\n\nsuccessfully submitted`);
    }
  };

  return(
    <div className="flex flex-col justify-center items-center h-screen bg-[#040c18]">
      <div className="rounded-md p-6 bg-[#f7fbffee] h-[550px] w-80">
        <h2 className="text-[#1d798d] text-xl font-bold text-center">Control Framework Upload</h2>
        <form 
          onSubmit={handleSubmit} 
          className="text-center items-center gap-4 my-6"
        >
          <div className="flex flex-col">
            <label className="font-semibold">Control ID</label>
            <input
              type='text'
              value={controlId}
              placeholder="e.g., CTRL-001"
              onChange={handleOnChangeControlId}
              onBlur={handleOnBlurControlId}
              className="bg-white mt-2 rounded-md p-2 border-1 border-gray-300"
            />
            <div className="min-h-8">
              {errors.controlId && <p className="text-red-500 text-sm mt-2">{errors.controlId}</p>}
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="font-semibold mb-2"
            >
              Category
            </label>
            <select 
              id="category"
              value={category}
              onChange={handleOnChangeCategory}
              onBlur={handleOnBlurCategory}
              className={`bg-white ${category=='' ? 'text-gray-500' : 'text-black'}`}
            >
              <option value='' className="text-gray-500">Select a category</option>
              <option value='Access Control' className="text-black">Access Control</option>
              <option value='Data Protection' className="text-black">Data Protection</option>
              <option value='Monitoring' className="text-black">Monitoring</option>
            </select>
            <div className="min-h-8">
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Description</label>
            <textarea
              value={description}
              placeholder='e.g., implement multi-factor authentication'
              onChange={handleOnChangeDescription}
              onBlur={handleOnBlurDescription}
              rows={4}
              maxLength={400}
              className="bg-white p-2 rounded-md mt-2 border border-gray-300 max-h-32 resize-none"
            />
            <div className="min-h-12">
              {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            </div>
          </div>
            <button
              type='submit'
              disabled={!controlId || !category || !description || !!errors.controlId || !!errors.category || !!errors.description}
              className="bg-[#1d798d] text-white px-6 py-3 mt-4 rounded-full hover:bg-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
              Submit
            </button>
        </form>
      </div>
    </div>
  );
}
