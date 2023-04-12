import styles from '@/styles/Navbar.module.css'

const Navpath = ({desc}) => {
    return (
        <div key={desc} className={styles.navpath}>{desc}</div>
    )
}

export default Navpath;