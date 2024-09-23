import React from 'react';

// auth
import idImage from './images/auth/id.svg';
import secureImage from './images/auth/secure.svg';

export const IdImage = () => <img src={idImage} alt='idImage' />;
export const SecureImage = () => <img src={secureImage} alt='secureImage' />;

// qr code
import qrcodeIconImage from './images/icons/qr-code.svg';
export const QRCodeIconImage = () => (
  <img src={qrcodeIconImage} width={30} height={30} alt='qrcodeIconImage' />
);

// status icons
import todoIconImage from './images/icons/todo.svg';
import doneIconImage from './images/icons/done.svg';
import lossIconImage from './images/icons/loss.svg';
import comingIconImage from './images/icons/coming.svg';
// rating
import veryGoodIconImage from './images/rating/very-good.png';
import goodIconImage from './images/rating/good.png';
import okayIconImage from './images/rating/okay.png';
import notGoodIconImage from './images/rating/not-good.png';
import notGoodAtAllIconImage from './images/rating/not-good-at-all.png';
import footerImage from './footerLogo.png';
import pageImage from './pageLogo.png';
import eagleImage from './eagle.png';

export const TodoIconImage = () => (
  <img src={todoIconImage} alt='todoIconImage' width='24' />
);
export const DoneIconImage = () => (
  <img src={doneIconImage} alt='doneIconImage' width='24' />
);
export const LossIconImage = () => (
  <img src={lossIconImage} alt='lossIconImage' width='24' />
);
export const ComingIconImage = () => (
  <img src={comingIconImage} alt='comingIconImage' width='24' />
);
export const VeryGoodIconImage = () => (
  <img src={veryGoodIconImage} alt='veryGoodIconImage' />
);
export const GoodIconImage = () => (
  <img src={goodIconImage} alt='goodIconImage' />
);
export const OkayIconImage = () => (
  <img src={okayIconImage} alt='okayIconImage' />
);
export const NotGoodIconImage = () => (
  <img src={notGoodIconImage} alt='notGoodIconImage' />
);
export const NotGoodAtAllIconImage = () => (
  <img src={notGoodAtAllIconImage} alt='notGoodAtAllIconImage' />
);

export const FooterImage = () => <img src={footerImage} alt='footerImage' />;
export const PageImage = () => <img src={pageImage} alt='pageImage' />;
export const EagleImage = () => <img src={eagleImage} alt='eagleImage' width={'100px'} />;
