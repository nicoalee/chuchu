import { TableContainer, Table, TableHead, TableRow, TableCell, FormGroup, InputLabel, Switch, TableBody } from "@mui/material";
import { useState } from "react";
import './CycleTable.css'

const CycleTable: React.FC = (props) => {
    const [ isPaymentMode, setIsPaymentMode ] = useState(false);

    return (
        <TableContainer sx={{ height: '100%' }}>
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
                        <TableCell className="table-cell">Cycle 1</TableCell>
                        <TableCell className="table-cell">Cycle 2</TableCell>
                        <TableCell className="table-cell">Cycle 3</TableCell>
                        <TableCell className="table-cell">Cycle 4</TableCell>
                        <TableCell className="table-cell">Cycle 5</TableCell>
                        <TableCell className="table-cell">Cycle 6</TableCell>
                        <TableCell className="table-cell">Cycle 7</TableCell>
                        <TableCell className="table-cell">Cycle 8</TableCell>
                        <TableCell className="table-cell">Cycle 9</TableCell>
                        <TableCell className="table-cell">Cycle 10</TableCell>
                        <TableCell className="table-cell">Cycle 11</TableCell>
                        <TableCell className="table-cell">Cycle 12</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="table-cell">Expenditure</TableCell>
                        <TableCell className="table-cell">110.2</TableCell>
                        <TableCell className="table-cell">283.2</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="table-cell">Rewards Earned</TableCell>
                        <TableCell className="table-cell">110.2</TableCell>
                        <TableCell className="table-cell">283.2</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                        <TableCell className="table-cell">271</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CycleTable;