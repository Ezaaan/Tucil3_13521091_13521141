import styles from '@/styles/Navpath.module.css'
import TextField from "@mui/material/TextField";

const Navpath = ({desc}) => {
    return (
        <div key={desc} className={styles.navpath}>
            <div className={styles.searchbar}>
                <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                label={desc}
                />
            </div>
        </div>
    )
}

export default Navpath;