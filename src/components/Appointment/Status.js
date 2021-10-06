import React from 'react'

/* Temporary display while an asynchronous call to DB is executing.
 * Takes message as a prop.
 */
function Status(props) {
  return(
    <main className="appointment__card appointment__card--status">
      <img
        className="appointment__status-image"
        src="images/status.png"
        alt="Loading"
      />
      <h1 className="text--semi-bold">{props.message}</h1>
    </main>
  )
}

export default Status;