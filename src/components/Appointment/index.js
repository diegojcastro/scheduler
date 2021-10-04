import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from "hooks/useVisualMode";


import 'components/Appointment/styles.scss';



function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE = "ERROR_SAVE";

  const {mode, transition, back} = useVisualMode( props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING); // Flagging this true changes nothing?
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((e) => {
        transition(ERROR_SAVE, true);
      });
  };

  function confirmDeletion() {
    transition(CONFIRM);
  };

  function deleteInterview() {
    transition(DELETING, true); // For some reason flagging this true doesn't change anything.
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((e) => {
        transition(ERROR_DELETE, true);
      });
  };
  
  function editInterview() {
    transition(EDIT);
  };

  return(
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDeletion}
          onEdit={editInterview}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving..."/>}
      {mode === CONFIRM && (
        <Confirm 
          onConfirm={deleteInterview} 
          onCancel={back}
          message="Are you sure you want to delete?"
        />
      )}
      {mode === DELETING && <Status message="Deleting."/>}
      {mode === EDIT && (
        <Form 
          interviewers={props.interviewers}
          value={props.interview.interviewer.id}
          name={props.interview.student}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Request failed on Delete operation."
          onClose={back}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Request failed on Save operation."
          onClose={back}
        />
      )}
    </article>
  );
};

export default Appointment;