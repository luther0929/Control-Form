import { useEffect, useState } from "react";
import { Input } from "./FormInput";
import { Select } from "./FormSelect";
import { Textarea } from "./FormTextarea";
import { Card } from "./Card"
import { Button } from "./Button";
import { Modal } from "./Modal";

export const ControlUploadForm = () => {

  const [controlId, setControlId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ controlId: '', category: '', description: '' });
  const [controls, setControls] = useState<Control[]>([]);

  const [editFormData, setEditFormData] = useState({ controlId: '', category: '', description: '' })
  const [editErrors, setEditErrors] = useState({ controlId: '', category: '', description: '' })

  const controlIdLabel = "Control ID"
  const controlIdPlaceholder = "CTRL-XXX"
  const categoryLabel = "Category"
  const categoryPlaceholder = "Select category"
  const categoryOptions = [{ value: "Access Control", label: "Access Control" }, { value: "Data Protection", label: "Data Protection" }, { value: "Monitoring", label: "Monitoring" }]
  const descriptionLabel = "Description"
  const descriptionPlaceholder = "Enter description here";
  
  interface Control {
    controlId: string;
    category: string;
    description: string;
  }

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

  const handleEditControlIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditFormData(prev => ({ ...prev, controlId: value }));
    setEditErrors(prev => ({ ...prev, controlId: validateControlId(value) }));
  };

  const handleEditControlIdBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditErrors(prev => ({ ...prev, controlId: validateControlId(value) }));
  };

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditFormData(prev => ({ ...prev, category: value }));
    setEditErrors(prev => ({ ...prev, category: validateCategory(value) }));
  };

  const handleEditCategoryBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditErrors(prev => ({ ...prev, category: validateCategory(value) }));
  };

  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditFormData(prev => ({ ...prev, description: value }));
    setEditErrors(prev => ({ ...prev, description: validateDescription(value) }));
  };

  const handleEditDescriptionBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditErrors(prev => ({ ...prev, description: validateDescription(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(validateForm()){
      const payload = {
        controlId,
        category,
        description,
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/submit`, {
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
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/controls`);
      if(!response.ok){
        alert("Unable to fetch controls");
        return;
      }
      const data = await response.json();
      setControls(data);
    } catch(err: any) {
      alert(err?.error || "Error fetching controls");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent, control: Control) => {
    e.preventDefault();

    const controlIdError = validateControlId(editFormData.controlId);
    const descriptionError = validateDescription(editFormData.description);
    const categoryError = validateCategory(editFormData.category);

    if (controlIdError || categoryError || descriptionError) {
      setEditErrors({
        controlId: controlIdError,
        category: categoryError,
        description: descriptionError
      });
      return;
    }

    const payload = {
      controlId: editFormData.controlId,
      category: editFormData.category,
      description: editFormData.description,
    }

    try{
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/controls/${control.controlId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if(!response.ok){
        alert(data.error || "Update failed");
        return;
      }

      alert("Update successful");
      fetchControls();
    } catch(error) {
      alert("Network error occured. Please try again later");
    }

  };

  const initializeEditForm = (control: Control) => {
    setEditFormData({
      controlId: control.controlId,
      category: control.category,
      description: control.description
    });
    setEditErrors({ controlId: '', category: '', description: '' });
  };

  const handleDelete = async (controlId: string) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/controls/${controlId}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      alert("Control deleted successfully");
      fetchControls();
    } catch(error) {
      alert("Network error occured. Please try again later");
    } 
  }

  useEffect(() => {
    fetchControls();
  }, [])

  return(
    <div className="flex gap-8 justify-center  min-h-screen bg-[#040c18]">
      <div className="rounded-md p-6 m-8 bg-[#f7fbff] w-auto self-start">
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
      {controls?.slice().reverse().map((control: Control) => (
        <div key={control.controlId} className="mb-8">
          <Card
            title={control.controlId}
            subtitle={control.category}
            description={control.description}
            button={
              <Modal 
                title="Update Control"
                buttonLabel="Update"
                onOpen={() => initializeEditForm(control)}
                onDelete={() => handleDelete(control.controlId)}
              >
                <form
                  id="edit-form"
                  onSubmit={(e) => handleEditSubmit(e, control)} 
                  className="flex flex-col gap-4 my-6"
                >
                  <div className="flex flex-row gap-12">
                    <div>
                      <Input
                        value={editFormData.controlId}
                        error={editErrors.controlId}
                        onChange={handleEditControlIdChange}
                        onBlur={handleEditControlIdBlur}
                        label={controlIdLabel}
                      />
                      <Select
                        value={editFormData.category}
                        error={editErrors.category}
                        onChange={handleEditCategoryChange}
                        onBlur={handleEditCategoryBlur}
                        options={categoryOptions}
                        label={categoryLabel}
                      />
                    </div>
                    <div>
                      <Textarea
                        value={editFormData.description}
                        error={editErrors.description}
                        onChange={handleEditDescriptionChange}
                        onBlur={handleEditDescriptionBlur}
                        rows={5}
                        maxLength={400}
                        label={descriptionLabel}
                      />
                    </div>
                  </div>
                </form>
              </Modal>
            }
          />
        </div>
      ))}
      {(!controls || controls.length === 0) && <p className="text-gray-500">No controls yet</p>}
      </div>
    </div>
  );
}
