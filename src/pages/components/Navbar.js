import styles from '@/styles/Navbar.module.css'

import Navpath from './Navpath';

const Navbar = ({show, func}) => {
    return (
        <>
            <div className={styles.header}>
                EFMap
            </div>
            <div className={`${styles.navbarContainer} ${show ? styles.selected : ' '}`} onClick={show ? null : func}>
                EFMap
                Menu

                <Navpath desc={"Asal"} />
                <Navpath desc={"Tujuan"} />
            </div>
        </>
    );
}

export default Navbar;