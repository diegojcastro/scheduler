import React from 'react';

/* Displays a blank (+) where an appointment can be added.
 * Takes onAdd as a prop.
 */
function Empty(props) {
  return(
  <main className="appointment__add">
    <img
      className="appointment__add-button"
      src="images/add.png"
      alt="Add"
      onClick={props.onAdd}
    />
  </main>
  );
};

export default Empty;