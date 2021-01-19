import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { intlShape } from 'react-intl';
import IconWithBigCaution from './IconWithBigCaution';
import IconWithIcon from './IconWithIcon';
import Icon from './Icon';
import ComponentUsageExample from './ComponentUsageExample';
import { realtimeDeparture as exampleRealtimeDeparture } from './ExampleData';

const LONG_ROUTE_NUMBER_LENGTH = 6;

function RouteNumber(props, context) {
  const mode = props.mode.toLowerCase();
  const { alertSeverityLevel, color, withBicycle } = props;
  const longText = props.text && props.text.length >= LONG_ROUTE_NUMBER_LENGTH;
  // Checks if route only has letters without identifying numbers and
  // length doesn't fit in the tab view
  const hasNoShortName =
    props.text &&
    new RegExp(/^([^0-9]*)$/).test(props.text) &&
    props.text.length > 3;
  const getColor = () => color || (props.isTransitLeg ? 'currentColor' : null);

  const getIcon = (icon, isCallAgency, hasDisruption, badgeFill, badgeText) => {
    if (isCallAgency) {
      return (
        <IconWithIcon
          color={color}
          className={`${mode} call`}
          img={icon || `icon-icon_${mode}`}
          subIcon="icon-icon_call"
        />
      );
    }

    if (hasDisruption || !!alertSeverityLevel) {
      return (
        <React.Fragment>
          <IconWithBigCaution
            alertSeverityLevel={alertSeverityLevel}
            color={color}
            className={mode}
            img={icon || `icon-icon_${mode}`}
          />
          {withBicycle && (
            <Icon
              img="icon-icon_bicycle_walk"
              className="itinerary-icon_with-bicycle"
            />
          )}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <IconWithIcon
          badgeFill={badgeFill}
          badgeText={badgeText}
          color={color}
          className={mode}
          img={icon || `icon-icon_${mode}`}
          subIcon=""
        />
        {withBicycle && (
          <Icon
            img="icon-icon_bicycle_walk"
            className="itinerary-icon_with-bicycle"
          />
        )}
      </React.Fragment>
    );
  };

  const rNumber = (
    <span
      className={cx('route-number', {
        vertical: props.vertical,
      })}
    >
      <span
        className={cx('vcenter-children', props.className)}
        aria-label={context.intl.formatMessage({
          id: mode,
          defaultMessage: 'Vehicle',
        })}
        role="img"
      >
        {!props.isTransitLeg && !props.renderModeIcons && (
          <div className="empty" />
        )}
        {props.isTransitLeg === true ? (
          <div className={`special-icon ${mode}`}>
            {getIcon(
              props.icon,
              props.isCallAgency,
              props.hasDisruption,
              props.badgeFill,
              props.badgeText,
            )}
          </div>
        ) : (
          <div className={`icon ${mode}`}>
            {getIcon(props.icon, props.isCallAgency, props.hasDisruption)}
          </div>
        )}
        {props.text && (
          <div
            className={cx(
              'vehicle-number-container-v'.concat(props.card ? '-map' : ''),
              {
                long: hasNoShortName,
              },
            )}
          >
            <span
              className={cx(
                'vehicle-number'.concat(props.card ? '-map' : ''),
                mode,
                { long: longText },
              )}
              style={{ color: !props.withBar && getColor() }}
            >
              {props.text}
            </span>
          </div>
        )}
        {props.isTransitLeg === false && props.duration > 0 && (
          <div className={`leg-duration-container ${mode} `}>
            <span className="leg-duration">{props.duration}</span>
          </div>
        )}
      </span>
    </span>
  );

  return (
    <>
      {props.withBar ? (
        <div className={cx('bar-container', { long: hasNoShortName })}>
          <div
            className={cx('bar', mode)}
            style={{ backgroundColor: getColor() }}
          >
            {rNumber}
          </div>
        </div>
      ) : (
        rNumber
      )}
    </>
  );
}

RouteNumber.description = () => (
  <div>
    <p>Display mode icon and route number with mode color</p>
    <ComponentUsageExample>
      <RouteNumber
        mode={exampleRealtimeDeparture.pattern.route.mode}
        text={exampleRealtimeDeparture.pattern.route.shortName}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="with disruption">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          hasDisruption
        />
      </div>
    </ComponentUsageExample>
    <ComponentUsageExample description="with callAgency">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          isCallAgency
        />
      </div>
    </ComponentUsageExample>
    <ComponentUsageExample description="in vertical configuration">
      <RouteNumber
        mode={exampleRealtimeDeparture.pattern.route.mode}
        text={exampleRealtimeDeparture.pattern.route.shortName}
        vertical
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="in vertical configuration with disruption">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          hasDisruption
          vertical
        />
      </div>
    </ComponentUsageExample>
    <ComponentUsageExample description="in vertical configuration with callAgency">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          isCallAgency
          vertical
        />
      </div>
    </ComponentUsageExample>
  </div>
);

RouteNumber.propTypes = {
  alertSeverityLevel: PropTypes.string,
  mode: PropTypes.string.isRequired,
  color: PropTypes.string,
  text: PropTypes.node,
  vertical: PropTypes.bool,
  className: PropTypes.string,
  hasDisruption: PropTypes.bool,
  withBar: PropTypes.bool,
  isCallAgency: PropTypes.bool,
  badgeFill: PropTypes.string,
  badgeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  renderModeIcons: PropTypes.bool,
  duration: PropTypes.number,
  isTransitLeg: PropTypes.bool,
  withBicycle: PropTypes.bool,
  card: PropTypes.bool,
};

RouteNumber.defaultProps = {
  alertSeverityLevel: undefined,
  badgeFill: undefined,
  badgeText: undefined,
  className: '',
  vertical: false,
  card: false,
  hasDisruption: false,
  text: '',
  withBar: false,
  isCallAgency: false,
  icon: undefined,
  isTransitLeg: false,
  renderModeIcons: false,
  withBicycle: false,
};

RouteNumber.contextTypes = {
  intl: intlShape.isRequired,
};

RouteNumber.displayName = 'RouteNumber';
export default RouteNumber;
