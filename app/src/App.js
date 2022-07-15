import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {
    Box,
    Button,
    createTheme,
    Grid,
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
    TextField,
    ThemeProvider
} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';

function App() {

    const [data, setData] = useState([]);
    const [url, setUrl] = useState('');
    const [variables, setVariables] = useState([]);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        setData([]);
        setUrl('');
    }, []);

    const changeHandler = (event) => {
        setFileName(event.target.files[0].name);
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setData(results.data)
                setVariables(Object.keys(results.data[0]))
            },
        });
    };

    const darkTheme = createTheme({
        palette: {
            mode: 'light',
        },
        root: {
            display: "flex",
            flexFlow: "column",
            height: "100vh",
        }
    });

    const SendRequest = () => {
        console.log(data);
    }

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Box bgcolor={"background.default"} color={"text.primary"}>
                    <Grid container spacing={2} columns={{ xs: 1, md: 6 }}>
                        <Grid item
                              xs={3}
                              sx={{
                                  padding: "70px 0",
                                  textAlign: "center"
                              }}
                              p={20}
                              mt="10%"
                        >
                            <Box sx={{
                                padding: "70px 0",
                                textAlign: "center"
                            }}
                            >
                                <Box mb={1}>
                                    <label htmlFor="upload-photo">
                                        <input
                                            style={{ display: 'none' }}
                                            id="upload-photo"
                                            name="upload-photo"
                                            type="file"
                                            onInput={changeHandler}
                                        />
                                        <Button startIcon={<AttachFileIcon />} color="secondary" variant="contained" component="span">
                                            Upload CSV
                                        </Button>
                                    </label>
                                </Box>
                                <Box sx={{ color: "green" }} mb={3}>
                                    {fileName}
                                </Box>
                                <Box  mb={3}>
                                    <TextField
                                        id="outlined-required"
                                        label="URL"
                                        size="small"
                                        onChange={e => setUrl(e.target.value)}
                                    />
                                </Box>
                                <Box  mb={3}>
                                    <Button variant="contained" color="primary" onClick={SendRequest}>Send</Button>
                                </Box>
                                <Box sx={{width: "70%", marginLeft: "15%"}}>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <b>File name</b>
                                                    </TableCell>
                                                    <TableCell align="right">{fileName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <b>Url</b>
                                                    </TableCell>
                                                    <TableCell align="right">{url}</TableCell>
                                                </TableRow>
                                                { variables ?
                                                    variables.map((value) => {
                                                        return(
                                                            <TableRow>
                                                                <TableCell component="th" scope="row">
                                                                    <b>Variables</b>
                                                                </TableCell>
                                                                <TableCell align="right">{value}</TableCell>
                                                            </TableRow>
                                                        )
                                                    }) : <></>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            Table
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>


        </>
    );
}

export default App;
