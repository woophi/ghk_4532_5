import { useEffect, useState } from 'react';
import { LoadingScreen } from './loading-screen';
import { LS, LSKeys } from './ls';
import { PlaceholderScreen } from './placeholder-screen';
import { appSt } from './style.css';
import { TransferActivesBrokerLayout } from './transfer-actives-broker';
import { TransferActivesCompleted } from './transfer-actives-completed';
import { TransferActivesFooter } from './transfer-actives/transfer-actives-footer';
import { TransferActivesHead } from './transfer-actives/transfer-actives-head';

import { Gap } from '@alfalab/core-components/gap';
import { Typography } from '@alfalab/core-components/typography';

export const App = () => {
  const [step, setStep] = useState<'init' | 'select' | 'loading' | 'placeholder'>('init');

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const handleClick = () => {
    // trackInAnalytics('TRANSFER_ACTIVES_FIRST_PAGE_CLICK', {
    //     experimentNumber: 'GHK-4532',
    //     experimentVariant: 'var1',
    // });

    setStep('select');
  };

  if (LS.getItem(LSKeys.ShowThx, null) && step === 'init') {
    return <TransferActivesCompleted />;
  }

  switch (step) {
    case 'init':
      return (
        <>
          <div className={appSt.container}>
            <TransferActivesHead
              title="Защита ваших активов"
              subtitle="Переведите активы в Альфа-Инвестиции и получите в подарок страховку ваших активов"
            />

            <div>
              <Typography.TitleMobile tag="h2" view="small" color="primary" weight="medium">
                Что это значит
              </Typography.TitleMobile>
              <Gap size={16} />

              <Typography.Text view="primary-medium">
                Если бумаги в вашем портфеле упадут более чем на 10% в течение 2 месяцев после перевода, мы компенсируем
                потери — максимум 2000 ₽
              </Typography.Text>
            </div>

            <TransferActivesFooter
              title="Как перевести активы"
              subtitle="По кнопке ниже. Хватит пары минуты, чтобы это сделать. А в офис приезжать не нужно 😉"
              btnText="Перевести"
              onClick={handleClick}
            />
          </div>
        </>
      );

    case 'select': {
      return <TransferActivesBrokerLayout goToLoadingScreen={() => setStep('loading')} />;
    }
    case 'loading': {
      return (
        <LoadingScreen
          title="Проверяем доступность перевода"
          redirectTimeoutMs={3500}
          redirectAction={() => setStep('placeholder')}
        />
      );
    }

    case 'placeholder': {
      return (
        <PlaceholderScreen
          btnText="Открыть брокерский счёт"
          title="Не получилось отправить заявку"
          subtitle="Нужно открыть брокерский счёт. Затем попробуйте снова, воспользовавшись формой для перевода активов"
          onClick={() => {
            window.location.replace('alfabank://investments/open_brokerage_account');
          }}
        />
      );
    }
    default:
      return null;
  }
};
