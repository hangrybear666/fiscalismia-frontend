import React, {useReducer} from 'react';
import {AxiosError} from 'axios'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/CancelSharp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Stack from '@mui/system/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { resourceProperties as res, serverConfig } from '../../resources/resource_properties';
import { postFoodItemImg, FileSizeError, deleteFoodItemImg} from '../../services/pgConnections';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ContentCardFoodPrices( props ) {
  const { foodItemId, header, originalPrice, subtitle, store, pricePerKg, kcalAmount, lastUpdated, details, elevation, img, imgHeight } = props
  const [open, setOpen] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('This is a notification.');
  const [notificationSeverity, setNotificationSeverity] = React.useState('info');
  const [imgFilePath, setImgFilePath] = React.useState(undefined);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  /**
   * Validation of user input is done in postFoodItemImg
   * - File Size
   * - File Extension
   * HTTP Status Responses are handled server-side
   * - 200 OK Log file path to user
   * - 409 Conflict - can be remedied via user input
   * - 400 unknown error
   * @param {*} event file is contained in event.target.files[0]
   */
  const handleFileUpload =  async(event) => {
    const response = await postFoodItemImg(event, foodItemId);
    if (response instanceof AxiosError) {
      // User Notification via Snackbar
      setNotificationMessage(response.message)
      setNotificationSeverity('warning')
      setOpen(true)
    } else if (response instanceof FileSizeError) {
      // User Notification via Snackbar
      setNotificationMessage(response.message)
      setNotificationSeverity('warning')
      setOpen(true)
    }
    if (response?.status == 200) {
      const filepath = response.data
      setImgFilePath(serverConfig.API_BASE_URL.concat('/').concat(filepath))
      // User Notification via Snackbar
      setNotificationMessage(`File persisted in path: ${filepath}`)
      setNotificationSeverity('success')
      setOpen(true)
    } else if (response?.status == 409) {
      console.error(response.data)
      // User Notification via Snackbar
      setNotificationMessage("STATUS 409: choose a different image.")
      setNotificationSeverity('error')
      setOpen(true)
    } else if (response?.status == 400) {
      console.error(response.data)
      // User Notification via Snackbar
      setNotificationMessage("STATUS 400: image could not be processed.")
      setNotificationSeverity('error')
      setOpen(true)
    }
  }

  const handleImgDeletion = async(event) => {
    event.preventDefault();
    const response = await deleteFoodItemImg(foodItemId)
    if (response.data?.results[0]?.filepath) {
      // // User Notification via Snackbar
      setNotificationMessage(`Image successfully deleted from path: ${response.data.results[0].filepath}`)
      setNotificationSeverity('info')
      setImgFilePath(null)
      setOpen(true)
    } else {
      setNotificationMessage("Image could not be deleted")
      setNotificationSeverity('error')
      setOpen(true)
    }
  };

  return (
    <>
      {/* USER NOTIFICATION */}
      {/* TODO Pull up into parents for generic logging. */}
      <Snackbar
        open={open}
        autoHideDuration={8000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleSnackbarClose}
        message={notificationMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleSnackbarClose} severity={notificationSeverity} sx={{ width: '100%' }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
      {/* FOOD ITEM CARD */}
      <Card
        elevation={elevation ? elevation : 4}
        variant="elevation"
        sx={{
          margin:0,
          height: '100%',
          border: '1px solid rgb(64,64,64,0.5)',
          paddingBottom:1.5
          }}
        square
      >
        {img || imgFilePath ?
        <Box sx={{position: 'relative'}}>
          {/* IMAGE queried from server */}
          <CardMedia
            sx={{ height: imgHeight ? imgHeight : 200 }}
            image={img ? img : imgFilePath ? imgFilePath : null}
            title={header}
            />
          {/* DELETE IMG Btn */}
          <IconButton size="large"
            sx={{position: 'absolute', right:0, top:0}}
            onClick={handleImgDeletion}
            >
            <CancelIcon sx={{ borderRadius:5, backgroundColor:'#cccccc'}} fontSize="inherit" />
          </IconButton>
        </Box>
        :
        // UPLOAD IMAGE
        <CardActions
                sx={{
                  justifyContent:'center',
                  alignItems:'center',
                  display:'flex'}}>
            <Paper elevation={4}>
              <form action="http://localhost:3002/api/fiscalismia/upload/food_item_img" method="post" encType="multipart/form-data">
                <Button
                  sx={{ borderRadius:0,
                    paddingY:2,
                    color:'#ffffff',
                    border: '1px solid rgba(64,64,64,0.2)',
                    backgroundColor: 'rgba(128,128,128,0.3)'
                  }}
                    component='label'
                    variant='contained'
                    startIcon={<CloudUploadIcon />}>
                    {res.UPLOAD_IMG}
                  <VisuallyHiddenInput type="file" onChange={handleFileUpload}/>
                </Button>
              </form>
            </Paper>
          </CardActions>}
        <CardContent sx={{ padding:0 }}>
          <Grid container spacing={1} sx={{ padding:0 }}>

            {/* HEADER */}
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              xs={header ? 12 : 0}
              sx={{ padding:0 }}
            >
            {header ?
            <Typography variant="overline" sx={{ fontSize: 16, paddingX: 2, letterSpacing:2 }} color="text.secondary" >
              {header}
            </Typography>
            : null }
            </Grid>

            {/* store */}
            <Grid
              xs={4}
              display='flex'
              justifyContent='center'
              alignItems="center"
              sx={{ paddingLeft:2,
                    borderTop: '1px solid rgb(50,50,50,0.4)',
                    borderBottom: '1px solid rgb(50,50,50,0.4)' }}
            >
              {store ?
              store
              : null}
            </Grid>

            {/* title & subtitle */}
            <Grid
              xs={4}
              display={( originalPrice || subtitle) ? 'flex' : 'none'}
              justifyContent='center'
              alignItems="center"
              sx={{ borderTop: '1px solid rgb(50,50,50,0.4)',
                    borderBottom: '1px solid rgb(50,50,50,0.4)' }}
            >
              <Stack >
                {originalPrice ?
                <Typography sx={{ ml:3, fontWeight:500, }} variant="h6" >
                  {originalPrice}
                </Typography>
                : null}
                {subtitle ?
                <Typography variant="subtitle1" sx={{ mb: 0.2, fontSize:15, letterSpacing:1 }} color="text.secondary">
                  {subtitle}
                </Typography>
                : null}
              </Stack>
            </Grid>


            {/* price per kg */}
            <Grid
              xs={4}
              display='flex'
              justifyContent='flex-start'
              alignItems="center"
              sx={{ display: 'flex',
                    paddingLeft:2,
                    borderTop: '1px solid rgb(50,50,50,0.4)',
                    borderBottom: '1px solid rgb(50,50,50,0.4)' }}
            >
              {pricePerKg ?
              <Paper elevation={0}>
                <Chip
                  label={pricePerKg}
                  sx={{
                    borderRadius:0,
                    paddingX: 0,
                    paddingY: 2,
                    border: '1px solid rgba(64,64,64,0.5)',
                    fontSize:15,
                    fontWeight:400,}}
                />
              </Paper>
              : null}
            </Grid>

            {/* DETAILS */}
            <Grid xs={12}
              display={details || lastUpdated ? 'flex' : 'none'}
              justifyContent="center"
              alignItems="center"
              sx={{ paddingLeft:2, paddingRight:2, paddingBottom:0,paddingTop:0}}>
              <Stack sx={{ mt: 1,minWidth: '100%' }}>
                <Chip label={kcalAmount} sx={{ borderRadius:0 }} variant="outlined" color="primary" icon={<LocalFireDepartmentIcon />} />
                <Chip label={lastUpdated} sx={{ mt:1, borderRadius:0 }} variant="outlined" color="primary" icon={<EventAvailableIcon />} />
                {details ?
                <Typography noWrap sx={{ mt: 0.3 }} variant="body2">
                  {details.map((e,i) => (
                    <React.Fragment key={e}>
                      • {e}
                      {i < details.length -1 ? <br /> : null}
                    </React.Fragment>
                  ))}
                </Typography>
                : null}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}