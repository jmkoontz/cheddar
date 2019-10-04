import React from 'react';
import './Loader.css';

import loader from './loader.gif';

class Loader extends React.Component {
    render () {
        return (
            <div className={'loader'}>
                <img src={loader} alt='Loading'/>
            </div>
        );
    }
}

export default Loader;