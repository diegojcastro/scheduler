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


/* Incorporates every subcomponent of Appointments as different modes.
 * Switches to each corresponding mode depending on the appointment state.
 * Takes id, interview, interviewer, time, bookInterview, cancelInterview as props.
 */
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

  // Called when Save is clicked from FORM component.
  // Attempts to bookInterview, and transitions to SHOW or ERROR depending on success.
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING); 
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((e) => {
        transition(ERROR_SAVE, true);
      });
  };

  // Called when trash can icon is clicked from SHOW component.
  function confirmDeletion() {
    transition(CONFIRM);
  };

  // Called after delete confirmation is clicked from CONFIRM component.
  // Attempts to deleteInterview, and transitions to EMPTY or ERROR depending on success.
  function deleteInterview() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((e) => {
        transition(ERROR_DELETE, true);
      });
  };
  
  // When edit icon is clicked from SHOW component, transitions to FORM component in Edit mode.
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