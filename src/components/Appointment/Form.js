import React, {useState} from 'react';

import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

function Form(props) {
  const [name, setName] = useState(props.name || "")
  const [interviewer, setInterviewer] = useState(props.value || null)

  const reset = () => {
    setName("")
    setInterviewer(null)
  }

  const cancel = () => {
    reset()
    props.onCancel()
  }

  const handleChange = (event) => {
    const {value} = event.target
    setName(value)
  }

  const handleSave = (event) => {
    props.onSave(name, interviewer)
  }


  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input 
            onChange={handleChange}
            className="appointment__create-input text--semi-bold"
            name="name"
            value={name}
            type="text"
            placeholder="Enter Student Name"
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={handleSave} confirm>Save</Button>
        </section>
      </section>
    </main> 
  );
};

    

export default Form;