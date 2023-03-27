import { TableContainer, Table, TableHead, TableRow, TableCell, FormGroup, InputLabel, Switch, TableBody } from "@mui/material";
import useBreakDownExpenditureByCycle from "hooks/useBreakDownExpenditureByCycle";
import { useState } from "react";
import './CycleTable.css'

const CycleTable: React.FC<{ cardId?: string }> = (props) => {
    const [ isPaymentMode, setIsPaymentMode ] = useState(false);
    const cycle = useBreakDownExpenditureByCycle(props.cardId, isPaymentMode);

    return (
        <TableContainer sx={{ height: '100%', width: '100%', overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormGroup>
                                <InputLabel 
                                    sx={{ color: 'white', fontSize: '0.875rem' }}
                                >
                                    {isPaymentMode ? 'Payment Cycle' : 'Actual Cycle'}
                                </InputLabel>
                                <Switch value={isPaymentMode} onChange={() => setIsPaymentMode(prev => !prev)} />
                            </FormGroup>
                        </TableCell>
                        {
                            cycle.map((cycleInstance) => (
                                <TableCell className="table-cell" key={cycleInstance.cycleIndex}>{cycleInstance.cycle}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="table-cell">Expenditure</TableCell>
                        {
                            cycle.map((cycleInstance) => (
                                <TableCell className="table-cell" key={cycleInstance.cycleIndex}>{cycleInstance.expenditure}</TableCell>
                            ))
                        }
                    </TableRow>
                    <TableRow>
                        <TableCell className="table-cell">Rewards Earned</TableCell>
                        {
                            cycle.map((cycleInstance) => (
                                <TableCell className="table-cell" key={cycleInstance.cycleIndex}>{cycleInstance.rewardsEarned}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CycleTable;