import React from 'react';

const HelpersContext = React.createContext({});

export function withHelpers(Component) {
  return function HelpedComponent(props) {
    return (
      <HelpersContext.Consumer>
        {helpers => <Component {...props} helpers={helpers} />}
      </HelpersContext.Consumer>
    );
  };
}

export default HelpersContext;
