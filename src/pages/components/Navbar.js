import styles from '@/styles/Navbar.module.css'

import Navpath from './Navpath';

const Navbar = ({show, func}) => {
    return (
        <>
            <div className={styles.header}>EF</div>
            <div className={`${styles.navbarContainer} ${show ? styles.selected : ' '}`} onClick={show ? null : func}>
                <Navpath desc={"Asal"} />
                <Navpath desc={"Tujuan"} />
            </div>
        </>
    );
}

export default Navbar;