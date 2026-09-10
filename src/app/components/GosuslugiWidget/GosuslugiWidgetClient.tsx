'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://pos.gosuslugi.ru/bin/script.min.js';
const WIDGET_URL = 'https://pos.gosuslugi.ru/form';
/** Идентификатор организации (opaId) из файла виджета Госуслуг */
const ORGANIZATION_ID = 376184;
const POS_PREFIX = '--pos-banner-fluid-35__';
const BG_35 = "url('https://pos.gosuslugi.ru/bin/banner-fluid/35/banner-fluid-bg-35.svg')";
const BG_35_2 = "url('https://pos.gosuslugi.ru/bin/banner-fluid/35/banner-fluid-bg-35-2.svg')";

const INITIAL_BANNER_OPTIONS: Record<string, string> = {
  background: '#50b3ff',
  'grid-template-columns': '100%',
  'grid-template-rows': '264px auto',
  'max-width': '100%',
  'text-font-size': '20px',
  'text-small-font-size': '14px',
  'text-margin': '0 0 12px 0',
  'description-margin': '0 0 24px 0',
  'button-wrap-max-width': '100%',
  'bg-url': BG_35,
  'bg-url-position': 'right bottom',
  'content-padding': '26px 24px 20px',
  'content-grid-row': '0',
  'logo-wrap-padding': '16px 12px 12px',
  'logo-width': '65px',
  'logo-wrap-top': '0',
  'slogan-font-size': '12px',
};

declare global {
  interface Window {
    Widget?: (url: string, opaId: number, isFz59?: boolean) => void;
  }
}

export type GosuslugiWidgetProps = {
  /** opaId организации в системе ПОС Госуслуг */
  widgetId?: number;
};

function setStyles(options: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(options).forEach(([key, value]) => {
    root.style.setProperty(`${POS_PREFIX}${key}`, value);
  });
}

function removeStyles(options: Record<string, string>) {
  const root = document.documentElement;
  Object.keys(options).forEach((key) => {
    root.style.removeProperty(`${POS_PREFIX}${key}`);
  });
}

export default function GosuslugiWidgetClient({
  widgetId = ORGANIZATION_ID,
}: GosuslugiWidgetProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const widgetBoundRef = useRef(false);

  const updateBannerSize = useCallback(() => {
    const banner = bannerRef.current;
    const width = banner ? banner.offsetWidth : document.body.offsetWidth;
    const options = { ...INITIAL_BANNER_OPTIONS };

    if (width > 340) {
      options['button-wrap-max-width'] = '209px';
    }

    if (width > 360) {
      options['bg-url'] = BG_35_2;
      options['bg-url-position'] = 'calc(100% + 135px) bottom';
    }

    if (width > 482) {
      options['text-font-size'] = '23px';
      options['text-small-font-size'] = '18px';
      options['bg-url-position'] = 'center bottom';
    }

    if (width > 568) {
      options['bg-url'] = BG_35;
      options['bg-url-position'] = 'calc(100% + 35px) bottom';
      options['text-font-size'] = '24px';
      options['text-small-font-size'] = '14px';
      options['grid-template-columns'] = '1fr 292px';
      options['grid-template-rows'] = '100%';
      options['content-grid-row'] = '1';
      options['content-padding'] = '48px 24px';
    }

    if (width > 783) {
      options['grid-template-columns'] = '1fr 390px';
      options['bg-url'] = BG_35_2;
      options['bg-url-position'] = 'calc(100% + 144px) bottom';
      options['text-small-font-size'] = '18px';
      options['content-padding'] = '30px 24px';
    }

    if (width > 820) {
      options['grid-template-columns'] = '1fr 420px';
    }

    if (width > 918) {
      options['bg-url-position'] = 'calc(100% + 100px) bottom';
    }

    if (width > 1098) {
      options['bg-url-position'] = 'center bottom';
      options['grid-template-columns'] = '1fr 557px';
      options['text-font-size'] = '32px';
      options['content-padding'] = '34px 50px';
      options['logo-width'] = '78px';
      options['slogan-font-size'] = '15px';
      options['logo-wrap-padding'] = '20px 16px 16px';
    }

    if (width > 1422) {
      options['max-width'] = '1422px';
      options['grid-template-columns'] = '1fr 720px';
      options.background = 'linear-gradient(90deg, #50b3ff 50%, #E0ECFE 50%)';
    }

    setStyles(options);
  }, []);

  const bindOfficialWidget = useCallback(() => {
    const banner = bannerRef.current ?? document.getElementById('js-show-iframe-wrapper');

    if (!banner || typeof window.Widget !== 'function' || widgetBoundRef.current) {
      return false;
    }

    // Как в исходном файле: Widget("https://pos.gosuslugi.ru/form", 376184)
    // Открывает iframe: /form?opaId=376184&fz59=false
    window.Widget(WIDGET_URL, widgetId);
    widgetBoundRef.current = true;
    banner.setAttribute('data-opa-id', String(widgetId));
    return true;
  }, [widgetId]);

  useEffect(() => {
    updateBannerSize();
    window.addEventListener('resize', updateBannerSize);

    return () => {
      window.removeEventListener('resize', updateBannerSize);
      removeStyles(INITIAL_BANNER_OPTIONS);
      widgetBoundRef.current = false;
    };
  }, [updateBannerSize]);

  useEffect(() => {
    if (bindOfficialWidget()) {
      return;
    }

    const timer = window.setInterval(() => {
      if (bindOfficialWidget()) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [bindOfficialWidget]);

  return (
    <>
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onReady={() => {
          bindOfficialWidget();
        }}
        onLoad={() => {
          bindOfficialWidget();
        }}
      />

      <div
        id="js-show-iframe-wrapper"
        ref={bannerRef}
        data-opa-id={widgetId}
      >
        <div className="pos-banner-fluid bf-35">
          <div className="bf-35__decor">
            <div className="bf-35__logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="bf-35__logo"
                src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg"
                alt="Госуслуги"
              />
              <div className="bf-35__slogan">Решаем вместе</div>
            </div>
          </div>

          <div className="bf-35__content">
            <div className="bf-35__description">
              <span className="bf-35__text">
                Направить обращение через Госуслуги
              </span>
              <span className="bf-35__text bf-35__text_small" />
            </div>

            <div className="bf-35__bottom-wrap">
              <div className="bf-35__btn-wrap">
                {/* pos-banner-btn_2 не удалять; другие классы не добавлять */}
                <button className="pos-banner-btn_2" type="button">
                  Написать о проблеме
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
