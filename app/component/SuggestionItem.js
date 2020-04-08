import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import pure from 'recompose/pure';

import Icon from './Icon';
import { getNameLabel, getIcon } from '../util/suggestionUtils';
import ComponentUsageExample from './ComponentUsageExample';

const SuggestionItem = pure(
  ({ item, intl, useTransportIcons, loading, isFavourite }) => {
    let icon;
    let iconstr;
    if (isFavourite) {
      iconstr = item.selectedIconId;
      icon = <Icon img={item.selectedIconId} />;
    } else if (item.properties && item.properties.mode && useTransportIcons) {
      iconstr = `icon-icon_${item.properties.mode}`;
      icon = (
        <Icon
          img={`icon-icon_${item.properties.mode}`}
          className={item.properties.mode}
        />
      );
    } else {
      // DT-3262 Icon as string for screen readers
      const layer = item.properties.layer.replace('route-', '').toLowerCase();
      if (intl) {
        iconstr = intl.formatMessage({
          id: layer,
          defaultMessage: layer,
        });
      }
      icon = (
        <Icon
          img={getIcon(item.properties.layer)}
          className={item.iconClass || ''}
        />
      );
    }
    const [name, label] = isFavourite
      ? [item.name, item.address]
      : getNameLabel(item.properties, false);
    // DT-3262 For screen readers
    const acri = (
      <div className="sr-only">
        <p>
          {' '}
          {iconstr} - {name} - {label}
        </p>
      </div>
    );
    const ri = (
      <div
        aria-hidden="true"
        className={cx('search-result', item.type, {
          favourite: item.type.startsWith('Favourite'),
          loading,
        })}
      >
        <span aria-label={iconstr} className="autosuggestIcon">
          {icon}
        </span>
        <div>
          <p className="suggestion-name">{name}</p>
          <p className="suggestion-label">{label}</p>
        </div>
      </div>
    );

    return (
      <div>
        {acri}
        {ri}
      </div>
    );
  },
);

SuggestionItem.propTypes = {
  item: PropTypes.object,
  useTransportIcons: PropTypes.bool,
  isFavourite: PropTypes.bool,
};

SuggestionItem.displayName = 'SuggestionItem';

const exampleFavourite = {
  type: 'FavouritePlace',
  properties: {
    name: 'HSL',
    address: 'Opastinsilta 6, Helsinki',
    layer: 'favouritePlace',
  },
};

const exampleAddress = {
  type: 'Feature',
  properties: {
    id: 'fi/uusimaa:103267060F-3',
    layer: 'address',
    source: 'openaddresses',
    name: 'Opastinsilta 6',
    housenumber: '6',
    street: 'Opastinsilta',
    postalcode: '00520',
    confidence: 1,
    accuracy: 'point',
    region: 'Uusimaa',
    localadmin: 'Helsinki',
    locality: 'Helsinki',
    neighbourhood: 'Itä-Pasila',
    label: 'Opastinsilta 6, Helsinki',
  },
};

const exampleRoute = {
  type: 'Route',
  properties: {
    gtfsId: 'HSL:1019',
    agency: { name: 'Helsingin seudun liikenne' },
    shortName: '19',
    mode: 'FERRY',
    longName: 'Kauppatori - Suomenlinna',
    layer: 'route-FERRY',
    link: '/linjat/HSL:1019',
  },
};

const exampleStop = {
  type: 'Stop',
  properties: {
    source: 'gtfsHSL',
    gtfsId: 'HSL:1130446',
    id: 'HSL:1130446#0221',
    name: 'Caloniuksenkatu',
    desc: 'Mechelininkatu 21',
    code: '0221',
    mode: 'tram',
    layer: 'stop',
    link: '/pysakit/HSL:1130446',
  },
};

SuggestionItem.description = () => (
  <div>
    <ComponentUsageExample description="Favourite">
      <SuggestionItem item={exampleFavourite} />
    </ComponentUsageExample>
    <ComponentUsageExample description="Address">
      <SuggestionItem item={exampleAddress} />
    </ComponentUsageExample>
    <ComponentUsageExample description="Route">
      <SuggestionItem item={exampleRoute} />
    </ComponentUsageExample>
    <ComponentUsageExample description="Stop">
      <SuggestionItem item={exampleStop} />
    </ComponentUsageExample>
  </div>
);

export default SuggestionItem;
