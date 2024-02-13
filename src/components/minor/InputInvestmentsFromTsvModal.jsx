import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res } from '../../resources/resource_properties';
import { postInvestmentsTsv } from '../../services/pgConnections';

export default function InputIncomeFromTsvModal( props ) {
  const { palette } = useTheme();
  const [open, setOpen] = React.useState(false);
  // Inputs
  const [investmentsTsvInput, setInvestmentsTsvInput] = React.useState('');
  // Selection
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '50%',
    width:'600px',
    bgcolor: 'background.paper',
    border: `2px solid ${palette.secondary.main}`,
    boxShadow: 24,
    p: 4,
  };
  /**
   * queries REST API for transformation of texttsv to INSERT INTO Statements
   * MANDATORY HEADER STRUCTURE:
   * execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date
   */
  const transformTsvToInsertStatements = async() => {
    const result = await postInvestmentsTsv(investmentsTsvInput)
    if (result?.status == 200 && result?.data?.length != 0) {
      console.log("INSERT STATEMENTS CREATED ")
      setInvestmentsTsvInput(result.data)
    } else if (result?.data?.length == 0) {
      console.error(result.response)
      setInvestmentsTsvInput('RESPONSE DATA IS EMPTY')
    } else if (result?.response?.data?.error) {
      console.log("REQUEST FAILED WITH ERROR:")
      console.error(result.response.data.error)
      setInvestmentsTsvInput(JSON.stringify(result.response.data.error))
    } else {
      console.log("transformTsvToInsertStatements failed for unknown reason")
      console.error(result.response)
      setInvestmentsTsvInput('unknown error')
    }
  }

  const inputChangeListener = (e) => {
      e.preventDefault();
      setInvestmentsTsvInput(e.target.value)
  }

  return (
    <>
    <Button
        onClick={handleOpen}
        variant="contained"
        color="tertiary"
        sx={{ borderRadius:0,
          border: `1px solid  ${palette.border.dark}`,
          boxShadow: palette.mode === 'light' ?  `3px 3px 8px 2px ${palette.grey[700]}` : '',
          mb:0.8
            }}
          startIcon={<AddCircleIcon />}
          >
        {res.MINOR_INPUT_INVESTMENTS_MODAL_OPEN}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="investments">{res.MINOR_INPUT_INVESTMENTS_MODAL_INPUT_TEXT_AREA_DESCRIPTION}</InputLabel>
            <Input
              id="investments"
              value={investmentsTsvInput}
              onChange={inputChangeListener}
              multiline
              minRows={15}
              maxRows={30}
              type="text"
            />
            <FormHelperText sx={{ color: palette.secondary.main }}>{res.MINOR_INPUT_INVESTMENTS_MODAL_INPUT_TEXT_AREA_HELPER}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={transformTsvToInsertStatements}
            sx={{ borderRadius:0,
                  margin:'0 auto',
                  mt:2,
                  ml:1,
                  border: `1px solid ${palette.border.dark}`,
                  width:'100%',
                  boxShadow: '3px 3px 5px 2px rgba(64,64,64, 0.7)',
                  }}
            variant="contained"
            endIcon={<FileDownloadDoneIcon />}>
            {res.SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}