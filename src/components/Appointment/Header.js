import React from 'react';

/* Displays the start time for each time slot of the interviews
 * available that day.
 * Takes a single time prop.
 */
function Header(props) {
  return(
  <header className="appointment__time">
    <h4 className="text--semi-bold">{props.time}</h4>
    <hr className="appointment__separator" />
  </header>
  );
};

export default Header;