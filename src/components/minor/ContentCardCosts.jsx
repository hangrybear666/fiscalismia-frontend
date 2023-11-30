import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';

export default function ContentCard( props ) {
  const { palette } = useTheme();
  const { img, header, amount, subtitle, icon, details, elevation, imgHeight, detailHeader } = props

  return (
    <Card
      elevation={elevation ? elevation : 4}
      variant="elevation"
      sx={{
        margin:0,
        height: '100%',
        border: `1px solid ${palette.border.light}`,
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
            sx={{ borderTop: `1px solid ${palette.border.light}`,
                  borderBottom: `1px solid ${palette.border.light}` }}
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
                  borderTop: `1px solid ${palette.border.light}`,
                  borderBottom: `1px solid ${palette.border.light}` }}
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
              {details.map((e,i) => {
                if (detailHeader && i === 0) {
                  return (
                    <React.Fragment key={e}>
                      <Typography sx={{textDecoration:'underline', mb:0.3, letterSpacing:2,fontSize:14, fontWeight:300}}>
                        {detailHeader}
                      </Typography>
                      <Typography sx={{fontSize:14}}>
                        • {e}
                        {i < details.length -1 ? <br /> : null}
                      </Typography>
                    </React.Fragment>
                  )
                } else
                return (
                  <React.Fragment key={e}>
                    <Typography sx={{fontSize:14}}>
                      • {e}
                      {i < details.length -1 ? <br /> : null}
                    </Typography>
                  </React.Fragment>
                )
              }
              )}
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