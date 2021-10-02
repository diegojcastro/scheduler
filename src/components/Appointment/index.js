import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';

import useVisualMode from "hooks/useVisualMode";


import 'components/Appointment/styles.scss';



function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  const fullInterview = {...props.interview}

  const {mode, transition, back} = useVisualMode( props.interview ? SHOW : EMPTY);

  return(
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onCancel={back}
        />
      )}
    </article>
  );
};

export default Appointment;