import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Container } from '@mui/material';
//pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

//library
import axios from 'axios';
import { nanoid } from 'nanoid';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function ATable() {
    //sort factor
    let sortFactor = ["username", "name", "email", "street"];

    //state datas
    let [datas, setDatas] = useState([]); //arr of data
    let [data, setData] = useState(''); // string we filter for search terms
    let [sortVal, setSortVal] = useState(''); //sorted values
    let [currentPage, setCurrentPage] = useState(0);
    let [pageLimit] = useState(3); // page limit

    //ref
    let fieldRef = useRef(null);


    //useEffect
    useEffect(() => {
        fieldRef.current.focus();
        apiCall(0, 3, 0); // (data 0 to 3, one more 0 is current page)
    }, []);

    // let apiCall = async () => {
    //     let response = await axios.get('https://jsonplaceholder.typicode.com/users')
    //     let result = response.data;
    //     setDatas(result);
    // }

    //pagination way   (increase is for moving > or <)
    let apiCall = async (start, end, increase) => {
        let response = await axios.get(`https://jsonplaceholder.typicode.com/users?_start=${start}&_end=${end}`)
        let result = response.data;
        setDatas(result);
        setCurrentPage(currentPage + increase)
    }

    //handleSearch, handleReset and handleSort
    let handleSearch = async (e) => {
        e.preventDefault();
        let response = await axios.get(`https://jsonplaceholder.typicode.com/users?q=${data}`)
        let result = response.data;
        setDatas(result);
        setData('');
    }

    let handleClear = useCallback(() => {
        apiCall();
    }, [data])

    // let handleSort = (e) => {
    //     setSortData(e.target.value);
    // }

    //handleChangeFilter
    let handleChangeFilter = async (e) => {
        let vals = e.target.value;
        setSortVal(vals);
        let response = await axios.get(`https://jsonplaceholder.typicode.com/users?_sort=${vals}&_order=asc`);
        let result = response.data;
        setDatas(result);
        setData('');
    }

    //pagination rendering
    let renderPagination = () => {
        if (currentPage === 0) {
            return (
                <Stack spacing={2}>
                    <Pagination count={2} variant="outlined" color="secondary" onClick={() => apiCall(3, 6, 1)} />
                </Stack>
            );
        }
        else if (currentPage < pageLimit - 1 && datas.length === pageLimit) {
            return (
                <Stack spacing={2}>
                    <Pagination count={2} variant="outlined" color="secondary" onClick={() => apiCall(3, 6, 1)} />
                </Stack>
            );
        }
    }

    return (
        <>
            {/* input and button */}
            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <TextField inputRef={fieldRef} onChange={(e) => setData(e.target.value)} value={data} variant="standard" label="go for a search!" color="warning" />
                <Box>
                    <Button variant='contained' color='success' size="large" onClick={handleSearch}>search</Button> &nbsp;
                    <Button variant='contained' color='error' size="large" onClick={() => handleClear()}>clear all!</Button> &nbsp;
                    <Button variant='contained' color='error' size="large">sort</Button>
                </Box>
            </Container>


            <br />

            {/* table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 600 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>UserName</StyledTableCell>
                            <StyledTableCell align="left">Name</StyledTableCell>
                            <StyledTableCell align="left">Email</StyledTableCell>
                            <StyledTableCell align="left">Street</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            datas.length === 0
                                ?
                                <TableRow>
                                    <TableCell colSpan={5} align='center'>No Data found!</TableCell>
                                </TableRow>
                                :
                                datas.map(item => (
                                    <StyledTableRow key={item.id} >
                                        <StyledTableCell align="left">
                                            {item.username}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{item.name}</StyledTableCell>
                                        <StyledTableCell align="left">{item.email}</StyledTableCell>
                                        <StyledTableCell align="left">{item?.address?.street}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </TableContainer >

            {/* select the filter */}
            <h3 style={{ color: 'black' }}>SORT</h3>
            <select style={{ padding: '0.5rem' }} onChange={handleChangeFilter} value={sortVal}>
                <option style={{ padding: '0.5rem', border: 'none' }}>Please select!</option>
                {sortFactor.map((item) => (
                    <option value={item} key={nanoid()} style={{ padding: '0.5rem', border: 'none' }}>
                        {item}
                    </option>
                ))}
            </select>

            {/* pagination */}
            {
                renderPagination()
            }
            {/* <Stack spacing={2}>
                <Pagination count={10} variant="outlined" color="secondary" />
            </Stack> */}
        </>
    );
}