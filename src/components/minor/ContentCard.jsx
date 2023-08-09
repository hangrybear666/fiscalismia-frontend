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
  const { img, header, amount, interval, icon, details, elevation } = props

  return (
    <Card
      elevation={elevation ? elevation : 4}
      variant="elevation"
      sx={{margin:1, height: '100%'}}
      square
    >
      {img ?
      <CardMedia
        sx={{ height: 200 }}
        image={img}
        title={header}
      />
      : null}
      <CardContent >
        <Grid container spacing={1}>

          {/* HEADER */}
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={header ? 12 : 0}
          >
          {header ?
          <Typography variant="overline" sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {header}
          </Typography>
          : null }
          </Grid>

          {/* AMOUNT & INTERVAL */}
          <Grid
            xs={icon ? 6 : 12}
            display={(amount || interval) ? 'flex' : 'none'}
            justifyContent={icon ? 'flex-end' : 'center'}
            alignItems="center"
            sx={{ borderTop: '1px solid rgb(50,50,50,0.4)',
                  borderBottom: '1px solid rgb(50,50,50,0.4)' }}
          >
            <Stack >
              {amount ?
              <Typography  sx={{ mt: 0.5 }} variant="h5" >
                {amount}€
              </Typography>
              : null}
              {interval ?
              <Typography variant="subtitle1" sx={{ mb: 0.5 }} color="text.secondary">
                {interval}
              </Typography>
              : null}
            </Stack>
          </Grid>

          {/* ICON */}
          <Grid
            xs={icon ? (amount || interval) ? 6 : 12 : 0}
            display={icon ? 'flex' : 'none'}
            justifyContent={(amount || interval) ? 'start' : 'center'}
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
            alignItems="center">
            {details ?
            <Typography sx={{ mt: 1 }} variant="body2">
              {details.map((e) => (
                <React.Fragment key={e}>
                  • {e}
                  <br />
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