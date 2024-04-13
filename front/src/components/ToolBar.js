import styles from '../css/ToolBar.module.css';
import NavButton from './NavButton';
import React from 'react';

function ToolBar(){

    return (<>
    <div className={styles.toolbarBody}>
        <NavButton nav={"library"}/>
        <NavButton nav={"profile"}/>
        
    </div>
    </>);
}

export default ToolBar;