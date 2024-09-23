import React from 'react';
import { Container, Box, Typography, Grid, Stack } from '@mui/material';
import { t } from 'i18next';
import dayjs from 'dayjs';
import eagle from '../../../../assets/eagle.png';
import footerLogo from '../../../../assets/footerLogo.png';
import leafImage from '../../../../assets/pageLogo.png';

interface Props {
  uri?: string;
}
class ComponentToPrint1 extends React.Component<Props> {
  render() {
    const strDate = dayjs().format('YYYY-MM-DD');
    return (
      <>
        <Container maxWidth='lg'>
        <Grid container style={{ pageBreakAfter: 'always', height: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            {/* Header Begin */}
            <Grid
              container
              sx={{ justifyContent: 'space-between', alignContent: 'center' }}
            >
              <img aria-label='leafImage' src={leafImage} width={205} />
              <div style={{ paddingTop: '35px', paddingRight: '60px', textAlign: 'right'}}>
                <Typography sx={{ fontSize: '11px', }}>{strDate}</Typography>
                <Typography sx={{ fontSize: '11px', }}>{t('page') + ' 1/2'}</Typography>
              </div>
            </Grid>
            {/* Header End */}
            {/* First Page Content Begin */}
            <div style={{flex: 1}}>
              <Typography sx={{ fontSize: '18px', fontWeight: '800', }} align='center' color='#007A5E'>
                {t('Information about participation in systematic follow-up')}
              </Typography>
              <br />
              <Grid sx={{ paddingRight: '60px', paddingLeft: '60px' }}>
                {/* <br /> */}
                <Typography
                  align='justify'
                  variant='body1'
                  sx={{ fontSize: '14px' }}
                >
                  {t(
                    'Open care Vuksen i Vallentuna carries out systematic follow-up of assistance-assessed interventions. The purpose is to ensure the quality of the assistance-assessed interventions carried out at Adult Public Services. Participation is voluntary and everyone who participates in outpatient interventions is asked to participate in the follow-up. The answers we receive are used to evaluate and improve our working methods and efforts. All data collected will be aggregated at group level.'
                  )}
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: '600', paddingY: '15px' }}  align='justify'>
                  {t(
                    'Confidentiality and consent to the processing of personal data'
                  )}
                </Typography>
                <Typography
                  align='justify'
                  variant='body1'
                  sx={{ fontSize: '14px' }}
                >
                  {t(
                    "I agree to my personal data in the form of contact details being processed to enable a systematic follow-up in the form of sending out questionnaires after six and twelve months respectively after starting the effort. I also agree that my personal data, together with the answers provided in the survey, are processed for the purpose of evaluating and improving Adult Public Care's work methods and efforts."
                  )}
                </Typography>
                <br />
                <Typography
                  align='justify'
                  variant='body1'
                  sx={{ fontSize: '14px' }}
                >
                  {t(
                    'All information that I provide in the systematic follow-up will be treated confidentially. This consent form will be kept in a locked cabinet by Open Care Adults to which unauthorized persons have no access.'
                  )}
                </Typography>
                <br />
                <Typography
                  align='justify'
                  variant='body1'
                  sx={{ fontSize: '14px' }}
                >
                  {t(
                    'Consented personal data will be processed at the latest from the date of signing this consent for 13 months after the start of the effort, or until you withdraw your consent. Then, when the processing of the personal data is finished, the answers are stored de-identified on a digital platform within the Nordic region.'
                  )}
                </Typography>
                <br />
                <Typography
                  align='justify'
                  variant='body1'
                  sx={{ fontSize: '14px' }}
                >
                  {t(
                    'Vallentuna municipality is the personal data controller for the processing of personal data as above. The personal data is only processed for the purpose stated in the consent sentence above. The legal basis for the processing is consent. The categories of personal data that are processed are only those specified in the consent sentence.'
                  )}
                </Typography>
                <br />
                <Typography
                  align='justify'
                  variant='body1'
                  sx={{ fontSize: '14px' }}
                >
                  {t(
                    'You can reach the Data Protection Officer via our Contact Center, telephone: 08-587 850 00.'
                  )}
                </Typography>
                <br />
                <br />
              </Grid>
            </div>
            {/* First Page Content End */}
            {/* Footer Begin */}
            <Grid
              container
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: '20px',
                paddingLeft: '20px',
              }}
            >
              <Stack direction='row'>
                <img aria-label='footerLogo' src={footerLogo} width={80}/>
                <Typography
                  align='left'
                  sx={{
                    fontSize: '10px',
                    fontWeight: '600',
                    marginLeft: '10px',
                  }}
                >
                  ÖPPENVÅRDEN VUXEN
                </Typography>
              </Stack>
              <Stack direction='row'>
                <Stack direction='column' alignItems='right' paddingLeft={'40px'}>
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: '600',
                      paddingTop: '50px',
                      textAlign: 'right'
                    }}
                  >
                    IFO ÖPPENVÅRD, STÖD OCH
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: '600',
                      paddingTop: '2px',
                      textAlign: 'right'
                    }}
                  >
                    FÖREBYGGANDE AREBTE
                  </Typography>
                </Stack>
                <Stack
                  justifyContent='center'
                  alignItems='center'
                  textAlign='right'
                  paddingLeft={'20px'}
                >
                  <img
                    aria-label='eagle'
                    src={eagle}
                    height='40px'
                    width='32px'
                  />
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: '800',
                      paddingBottom: '0px',
                    }}
                  >
                    Vallentuna
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: '800',
                      paddingTop: '0px',
                    }}
                  >
                    kommun
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            {/* Footer End */}
          </Grid>

          <Grid container style={{ pageBreakAfter: 'always', height: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            {/* Header Begin */}
            <Grid
              container
              sx={{ justifyContent: 'space-between', alignContent: 'center' }}
            >
              <img aria-label='leafImage' src={leafImage} width={200} />
              <div style={{ paddingTop: '35px', paddingRight: '60px', textAlign: 'right'}}>
                <Typography sx={{ fontSize: '11px', }}>{t('page') + ' 2/2'}</Typography>
              </div>
            </Grid>
            {/* Header End */}
            {/* Second Page Content Begin */}
            <Grid sx={{ paddingRight: '60px', paddingLeft: '60px', flex: 1 }}>
              <Stack direction='row' gap={2} justifyContent='space-between'>
                <Stack>
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('Singnature of name:')}
                  </Typography>
                  <br />
                  <Typography>_________________</Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('Clarification of name:')}
                  </Typography>
                  <br />
                  <Typography>_________________</Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('Date of name:')}
                  </Typography>
                  <br />
                  <Typography>_________________</Typography>
                </Stack>
              </Stack>
              <br />
              <br />
              <Stack gap={2} direction='row' justifyContent='justify'>
                <Typography sx={{ fontSize: '14px' }}>
                  {t('Address of name:')}
                </Typography>
                <Stack>
                  <Typography>
                    ______________________________________________________
                  </Typography>
                  <br />
                  <Typography>
                    ______________________________________________________
                  </Typography>
                </Stack>
              </Stack>
              <br />
              <br />
              <Typography sx={{ fontSize: '14px', fontWeight: '600', marginY: '10px', borderBottom: '3px solid #d8e4c4' }} align='left'>
                {t(
                  'Information about the data protection regulation (EU) 2016/679'
                )}
              </Typography>
              <Typography sx={{ fontSize: '11px' }} align='justify'>
                {t(
                  'Personal data is processed according to the rules contained in the data protection regulation or with the support of other legislation relating to personal data. According to Article 15 of the data protection regulation, you have the right to receive information about which personal data about you we process and how we process it, free of charge, once per calendar year, after a written and signed application has been sent to us. You also have the right to request correction according to Article 16 of the same regulation.'
                )}
              </Typography>
              <br />
              <Typography sx={{ fontSize: '11px' }} align='justify'>
                {t(
                  "More about Vallentuna municipality's handling of personal data can be found at www.vallentuna.se/personpädtning."
                )}
              </Typography>
            </Grid>
            {/* Second Page Content End */}
            {/* Footer Begin */}
            <Grid
              container
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: '20px',
                paddingLeft: '20px',
              }}
            >
              <Stack direction='row'>
                <img aria-label='footerLogo' src={footerLogo} width={80}/>
                <Typography
                  align='left'
                  sx={{
                    fontSize: '10px',
                    fontWeight: '600',
                    marginLeft: '10px',
                  }}
                >
                  ÖPPENVÅRDEN VUXEN
                </Typography>
              </Stack>
              <Stack direction='row'>
                <Stack direction='column' alignItems='right' paddingLeft={'40px'}>
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: '600',
                      paddingTop: '50px',
                      textAlign: 'right'
                    }}
                  >
                    IFO ÖPPENVÅRD, STÖD OCH
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: '600',
                      paddingTop: '2px',
                      textAlign: 'right'
                    }}
                  >
                    FÖREBYGGANDE AREBTE
                  </Typography>
                </Stack>
                <Stack
                  justifyContent='center'
                  alignItems='center'
                  textAlign='right'
                  paddingLeft={'20px'}
                >
                  <img
                    aria-label='eagle'
                    src={eagle}
                    height='40px'
                    width='32px'
                  />
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: '800',
                      paddingBottom: '0px',
                    }}
                  >
                    Vallentuna
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: '800',
                      paddingTop: '0px',
                    }}
                  >
                    kommun
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            {/* Footer End */}
          </Grid>
        </Container>
      </>
    );
  }
}

export default ComponentToPrint1;
