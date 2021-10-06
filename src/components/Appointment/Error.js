import React from 'react';

/* Displays an Error message when a Save or Delete request to server
 * times out or fails for another reason.
 * Takes onClose and message as props.
 */
function Error(props) {
  return(
    <main className="appointment__card appointment__card--error">
      <section className="appointment__error-message">
        <h1 className="text--semi-bold">Error</h1>
        <h3 className="text--light">{props.message}</h3>
      </section>
      <img
        onClick={props.onClose}
        className="appointment__error-close"
        src="images/close.png"
        alt="Close"
      />
    </main>
  );
};

export default Error;