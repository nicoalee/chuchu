import { Box } from "@mantine/core";
import classes from './CardHeading.module.css'

function CardOutline() {
    return (
        <Box className={classes['card-image']}>
            <Box style={{ backgroundColor: 'transparent', width: '100%', height: '25%' }}></Box>
            <Box style={{ backgroundColor: 'white', width: '100%', height: '25%' }}></Box>
            <Box style={{ backgroundColor: 'transparent', width: '100%', height: '50%' }}></Box>
        </Box>
    )
}

export default CardOutline;