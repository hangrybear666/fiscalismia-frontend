import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/system/Stack';
import { Paper } from '@mui/material';


export default function ContentCard( props ) {
  const { img, header, amount, subtitle, icon, details, elevation, imgHeight } = props

  return (
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
      {img ?
      <CardMedia
        sx={{ height: imgHeight ? imgHeight : 200 }}
        image={img}
        title={header}
      />
      : null}
      <CardContent sx={{ padding:0 }}>
        <Grid container spacing={1} sx={{ padding:0 }}>

          {/* HEADER */}
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={header ? 12 : 0}
          >
          {header ?
          <Typography variant="overline" sx={{ fontSize: 14, paddingX: 2 }} color="text.secondary" >
            {header}
          </Typography>
          : null }
          </Grid>

          {/* AMOUNT & SUBTITLE */}
          <Grid
            xs={icon ? 6 : 12}
            display={(amount || subtitle) ? 'flex' : 'none'}
            justifyContent={icon ? 'flex-end' : 'center'}
            alignItems="center"
            sx={{ borderTop: '1px solid rgb(50,50,50,0.4)',
                  borderBottom: '1px solid rgb(50,50,50,0.4)' }}
          >
            <Stack >
              {amount ?
              <Typography  sx={{ mt: 0.2 }} variant="h5" >
                {amount}€
              </Typography>
              : null}
              {subtitle ?
              <Typography variant="subtitle1" sx={{ mb: 0.2 }} color="text.secondary">
                {subtitle}
              </Typography>
              : null}
            </Stack>
          </Grid>

          {/* ICON */}
          <Grid
            xs={icon ? (amount || subtitle) ? 6 : 12 : 0}
            display={icon ? 'flex' : 'none'}
            justifyContent={(amount || subtitle) ? 'start' : 'center'}
            alignItems="center"
            sx={{ paddingLeft:2,
                  borderTop: '1px solid rgb(50,50,50,0.4)',
                  borderBottom: '1px solid rgb(50,50,50,0.4)' }}
          >
            {icon ?
            icon
            : null}
          </Grid>

          {/* DETAILS */}
          <Grid xs={details ? 12 : 0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ paddingLeft:2, paddingRight:2, paddingBottom:0,paddingTop:0}}>
            {details ?
            <Typography noWrap sx={{ mt: 1 }} variant="body2">
              {details.map((e,i) => (
                <React.Fragment key={e}>
                  • {e}
                  {i < details.length -1 ? <br /> : null}
                </React.Fragment>
              ))}
            </Typography>
            : null}
          </Grid>
        </Grid>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </CardContent>
    </Card>
  );
}