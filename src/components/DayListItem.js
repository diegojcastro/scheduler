import React from "react";
import classnames from 'classnames';

import 'components/DayListItem.scss'

export default function DayListItem(props) {
  const dayClass = classnames('day-list__item', {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots===0
  });

  let formatSpots;
  if (!props.spots) formatSpots = 'no spots remaining';
  else if (props.spots === 1) formatSpots = '1 spot remaining';
  else formatSpots = props.spots + ' spots remaining';


  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots}</h3>
    </li>
  );
}