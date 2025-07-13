import { useEffect, useState } from "react";
import { Input } from "./FormInput";
import { Select } from "./FormSelect";
import { Textarea } from "./FormTextarea";
import { Card } from "./Card"
import { Button } from "./Button";

export const ControlUploadForm = () => {

  const [controlId, setControlId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ controlId: '', category: '', description: '' });
  const [controls, setControls] = useState([]);

  const controlIdLabel = "Control ID"
  const controlIdPlaceholder = "CTRL-XXX"
  const categoryLabel = "Category"
  const categoryPlaceholder = "Select category"
  const categoryOptions = [{ value: "Access Control", label: "Access Control" }, { value: "Data Protection", label: "Data Protection" }, { value: "Monitoring", label: "Monitoring" }]
  const descriptionLabel = "Description"
  const descriptionPlaceholder = "Enter description here";
  

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(validateForm()){
      const payload = {
        controlId,
        category,
        description,
      }

      try {
        const response = await fetch("http://localhost:3000/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if(!response.ok){
          alert(data.error || "Submiossion failed");
          return;
        }

        alert("Submission successful");
        fetchControls();

      } catch (error) {
        alert(`Network error occurred. Please try again later`);
      }
    }
  };

  const fetchControls = async() => {
    try{
      const response = await fetch("http://localhost:3000/controls");
      if(!response.ok){
        alert("Unable to fetch controls");
        return;
      }
      const data = await response.json();
      setControls(data);
    } catch(err: any) {
      alert(err?.error || "Error fetching controls");
    }
  }

  useEffect(() => {
    fetchControls();
  }, [])

  return(
    <div className="flex gap-8 justify-center  min-h-screen bg-[#040c18]">
      <div className="rounded-md p-6 m-8 bg-[#f7fbffee] w-auto self-start">
        <h1 className="text-[#1d798d] text-xl font-bold text-center">Control Framework Upload</h1>
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-4 my-6"
        >
          <div className="flex flex-row gap-12">
            <div>
              <Input
                value={controlId}
                error={errors.controlId}
                onChange={handleOnChangeControlId}
                onBlur={handleOnBlurControlId}
                placeholder={controlIdPlaceholder}
                label={controlIdLabel}
              />
              <Select
                value={category}
                error={errors.category}
                onChange={handleOnChangeCategory}
                onBlur={handleOnBlurCategory}
                options={categoryOptions}
                placeholder={categoryPlaceholder}
                label={categoryLabel}
              />
            </div>
            <div>
              <Textarea
                value={description}
                error={errors.description}
                onChange={handleOnChangeDescription}
                onBlur={handleOnBlurDescription}
                rows={5}
                maxLength={400}
                placeholder={descriptionPlaceholder}
                label={descriptionLabel}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              type='submit'
              isDisabled={!controlId || !category || !description || !!errors.controlId || !!errors.category || !!errors.description}
              label="Submit"
            />
          </div>
        </form>
      </div>

      <div className="max-h-[500px] overflow-y-auto m-8 rounded-md p-6 bg-[#f7fbffee] min-h-10 w-80">
      {controls?.slice().reverse().map((control: any) => (
        <div key={control.controlId} className="mb-8">
          <Card
            title={control.controlId}
            subtitle={control.category}
            description={control.description}
            button={
              <Button
                type="button"
                label="Update"
              />
            }
          />
        </div>
      ))}
      {(!controls || controls.length === 0) && <p className="text-gray-500">No controls yet</p>}
      </div>
    </div>
  );
}
