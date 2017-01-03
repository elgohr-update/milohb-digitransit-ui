import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import getContext from 'recompose/getContext';

import getLegText from '../util/leg-text-util';
import TimeFrame, { dateOrEmpty } from './TimeFrame';
import { displayDistance } from '../util/geo-utils';
import RouteNumber from './RouteNumber';
import Icon from './Icon';
import RelativeDuration from './RelativeDuration';
import ComponentUsageExample from './ComponentUsageExample';

const SummaryRow = (props) => {
  let mode;
  const data = props.data;
  const startTime = moment(data.startTime);
  const endTime = moment(data.endTime);
  const duration = endTime.diff(startTime);
  const legs = [];
  let realTimeAvailable = false;
  let noTransitLegs = true;

  data.legs.forEach((leg) => {
    if (leg.transitLeg || leg.rentedBike) {
      if (noTransitLegs && leg.realTime) {
        realTimeAvailable = true;
      }
      noTransitLegs = false;
    }
  });

  let lastLegRented = false;

  data.legs.forEach((leg, i) => {
    if (leg.rentedBike && lastLegRented) {
      return;
    }

    lastLegRented = leg.rentedBike;

    if (leg.transitLeg || leg.rentedBike || noTransitLegs) {
      mode = leg.mode;

      if (leg.rentedBike) {
        mode = 'CITYBIKE';
      }

      legs.push(
        <div key={i} className="leg flex-vertical">
          {props.breakpoint === 'large' &&
            <div className="departure-stop overflow-fade">
              &nbsp;{(leg.transitLeg || leg.rentedBike) && leg.from.name}
            </div>
          }
          <RouteNumber
            mode={mode}
            text={getLegText(leg)}
            className={cx('line', mode.toLowerCase())}
            vertical
          />
        </div>,
      );
    }
  });

  let firstLegStartTime = null;

  if (!noTransitLegs) {
    let firstDeparture = false;
    if (data.legs[1] != null && !(data.legs[1].rentedBike || data.legs[0].transitLeg)) {
      firstDeparture = data.legs[1].startTime;
    }
    if (data.legs[0].transitLeg && !data.legs[0].rentedBike) {
      firstDeparture = data.legs[0].startTime;
    }
    if (firstDeparture) {
      firstLegStartTime = (
        <div className="itinerary-first-leg-start-time">
          {moment(firstDeparture).format('HH:mm')}
        </div>);
    }
  }


  const classes = cx(['itinerary-summary-row', 'cursor-pointer', {
    passive: props.passive,
    'bp-large': props.breakpoint === 'large',
    open: props.open || props.children,
  }]);

  const NOW = moment();

  return (
    <div
      className={classes}
      onClick={() => props.onSelect(props.hash)}
    >
      <div className="itinerary-duration-and-distance">
        <div className="itinerary-duration">
          <RelativeDuration duration={duration} />
        </div>
        <div className="itinerary-walking-distance">
          <Icon img="icon-icon_walk" viewBox="6 0 40 40" />
          {displayDistance(data.walkDistance)}
        </div>
      </div>
      {props.open || props.children ? [
        <span className="flex-grow">
          <FormattedMessage
            id="itinerary-page.title"
            defaultMessage="Itinerary"
            tagName="h2"
          /><span className="itinerary-title-timeframe">
            <TimeFrame withSlashes={false} startTime={data.startTime} endTime={data.endTime} />
          </span>
        </span>,
        <div
          key="arrow"
          className="action-arrow-click-area"
          onClick={(e) => {
            e.stopPropagation();
            props.onSelectImmediately(props.hash);
          }}
        >
          <div className="action-arrow">
            <Icon img="icon-icon_arrow-collapse--right" />
          </div>
        </div>,
        props.children,
      ] : [
        <div
          className={cx('itinerary-start-time', { 'realtime-available': realTimeAvailable })}
          key="startTime"
        ><span className="itinerary-start-date" >&nbsp;{dateOrEmpty(startTime, NOW)}</span>
          <span>{startTime.format('HH:mm')}</span>
          {firstLegStartTime}
        </div>,
        <div className="itinerary-legs" key="legs">
          {legs}
        </div>,
        <div className="itinerary-end-time" key="endtime">
          {endTime.format('HH:mm')}
        </div>,
        <div
          key="arrow"
          className="action-arrow-click-area"
          onClick={(e) => {
            e.stopPropagation();
            props.onSelectImmediately(props.hash);
          }}
        >
          <div className="action-arrow">
            <Icon img="icon-icon_arrow-collapse--right" />
          </div>
        </div>,
      ]}
    </div>);
};


SummaryRow.propTypes = {
  data: React.PropTypes.object.isRequired,
  passive: React.PropTypes.bool,
  onSelect: React.PropTypes.func.isRequired,
  onSelectImmediately: React.PropTypes.func.isRequired,
  hash: React.PropTypes.number.isRequired,
  children: React.PropTypes.node,
  open: React.PropTypes.bool,
  breakpoint: React.PropTypes.string.isRequired,
};

SummaryRow.displayName = 'SummaryRow';

const exampleData = {
  startTime: 1478611781000,
  endTime: 1478612600000,
  walkDistance: 770,
  legs: [
    {
      realTime: false,
      transitLeg: false,
      startTime: 1478611781000,
      endTime: 1478612219000,
      mode: 'WALK',
      distance: 483.84600000000006,
      duration: 438,
      rentedBike: false,
      route: null,
      from: { name: 'Messuaukio 1, Helsinki' },
    },
    {
      realTime: false,
      transitLeg: true,
      startTime: 1478612220000,
      endTime: 1478612340000,
      mode: 'BUS',
      distance: 586.4621425755712,
      duration: 120,
      rentedBike: false,
      route: { shortName: '57' },
      from: { name: 'Ilmattarentie' },
    },
    {
      realTime: false,
      transitLeg: false,
      startTime: 1478612341000,
      endTime: 1478612600000,
      mode: 'WALK',
      distance: 291.098,
      duration: 259,
      rentedBike: false,
      route: null,
      from: { name: 'Veturitie' },
    },
  ],
};

SummaryRow.description = (
  <div>
    <p>
      Displays a summary of an itinerary.
    </p>
    <ComponentUsageExample description="passive">
      <SummaryRow
        breakpoint="small"
        data={exampleData}
        passive
        onSelect={() => {}}
        onSelectImmediately={() => {}}
        hash={1}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="active">
      <SummaryRow
        breakpoint="small"
        data={exampleData}
        onSelect={() => {}}
        onSelectImmediately={() => {}}
        hash={1}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="open">
      <SummaryRow
        breakpoint="small"
        open
        data={exampleData}
        onSelect={() => {}}
        onSelectImmediately={() => {}}
        hash={1}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="passive">
      <SummaryRow
        breakpoint="large"
        data={exampleData}
        passive
        onSelect={() => {}}
        onSelectImmediately={() => {}}
        hash={1}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="active">
      <SummaryRow
        breakpoint="large"
        data={exampleData}
        onSelect={() => {}}
        onSelectImmediately={() => {}}
        hash={1}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="open">
      <SummaryRow
        breakpoint="large"
        open
        data={exampleData}
        onSelect={() => {}}
        onSelectImmediately={() => {}}
        hash={1}
      />
    </ComponentUsageExample>
  </div>
);

const withBreakPoint = getContext({
  breakpoint: React.PropTypes.string.isRequired })(SummaryRow);

export { SummaryRow as component, withBreakPoint as default };
