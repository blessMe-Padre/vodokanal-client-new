'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://pos.gosuslugi.ru/bin/script.min.js';
const WIDGET_URL = 'https://pos.gosuslugi.ru/form';
const DEFAULT_WIDGET_ID = 376184;
const BG_SMALL = "url('https://pos.gosuslugi.ru/bin/banner-fluid/2/banner-fluid-bg-2-small.svg')";
const BG_LARGE = "url('https://pos.gosuslugi.ru/bin/banner-fluid/2/banner-fluid-bg-2.svg')";

declare global {
  interface Window {
    Widget?: (url: string, id: number) => void;
  }
}

export type GosuslugiWidgetProps = {
  widgetId?: number;
};

function setBannerVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export default function GosuslugiWidgetClient({
  widgetId = DEFAULT_WIDGET_ID,
}: GosuslugiWidgetProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  const updateBannerSize = useCallback(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const width = banner.offsetWidth;

    if (width <= 405) {
      setBannerVars({
        '--pos-banner-fluid-2__grid-template-columns': '100%',
        '--pos-banner-fluid-2__grid-template-rows': '310px auto',
        '--pos-banner-fluid-2__decor-grid-column': 'initial',
        '--pos-banner-fluid-2__decor-grid-row': 'initial',
        '--pos-banner-fluid-2__decor-padding': '30px 30px 0 30px',
        '--pos-banner-fluid-2__content-padding': '0 30px 30px 30px',
        '--pos-banner-fluid-2__bg-url': BG_SMALL,
        '--pos-banner-fluid-2__bg-position': 'calc(10% + 64px) calc(100% - 20px)',
        '--pos-banner-fluid-2__bg-size': 'cover',
        '--pos-banner-fluid-2__slogan-font-size': '20px',
        '--pos-banner-fluid-2__slogan-line-height': '32px',
        '--pos-banner-fluid-2__logo-wrap-padding': '20px 30px 30px 40px',
        '--pos-banner-fluid-2__logo-wrap-top': '0',
        '--pos-banner-fluid-2__logo-wrap-bottom': 'initial',
        '--pos-banner-fluid-2__logo-wrap-border-radius': '0 0 0 80px',
      });
      return;
    }

    if (width <= 500) {
      setBannerVars({
        '--pos-banner-fluid-2__grid-template-columns': '100%',
        '--pos-banner-fluid-2__grid-template-rows': '310px auto',
        '--pos-banner-fluid-2__decor-grid-column': 'initial',
        '--pos-banner-fluid-2__decor-grid-row': 'initial',
        '--pos-banner-fluid-2__decor-padding': '30px 30px 0 30px',
        '--pos-banner-fluid-2__content-padding': '0 30px 30px 30px',
        '--pos-banner-fluid-2__bg-url': BG_SMALL,
        '--pos-banner-fluid-2__bg-position': 'calc(10% + 64px) calc(100% - 20px)',
        '--pos-banner-fluid-2__bg-size': 'cover',
        '--pos-banner-fluid-2__slogan-font-size': '24px',
        '--pos-banner-fluid-2__slogan-line-height': '32px',
        '--pos-banner-fluid-2__logo-wrap-padding': '30px 50px 30px 70px',
        '--pos-banner-fluid-2__logo-wrap-top': '0',
        '--pos-banner-fluid-2__logo-wrap-bottom': 'initial',
        '--pos-banner-fluid-2__logo-wrap-border-radius': '0 0 0 80px',
      });
      return;
    }

    if (width <= 585) {
      setBannerVars({
        '--pos-banner-fluid-2__grid-template-columns': 'min-content 1fr',
        '--pos-banner-fluid-2__grid-template-rows': '100%',
        '--pos-banner-fluid-2__decor-grid-column': '2',
        '--pos-banner-fluid-2__decor-grid-row': '1',
        '--pos-banner-fluid-2__decor-padding': '30px 30px 30px 0',
        '--pos-banner-fluid-2__content-padding': '30px',
        '--pos-banner-fluid-2__bg-url': BG_SMALL,
        '--pos-banner-fluid-2__bg-position': '0% calc(100% - 70px)',
        '--pos-banner-fluid-2__bg-size': 'cover',
        '--pos-banner-fluid-2__slogan-font-size': '24px',
        '--pos-banner-fluid-2__slogan-line-height': '32px',
        '--pos-banner-fluid-2__logo-wrap-padding': '30px 30px 24px 40px',
        '--pos-banner-fluid-2__logo-wrap-top': 'initial',
        '--pos-banner-fluid-2__logo-wrap-bottom': '0',
        '--pos-banner-fluid-2__logo-wrap-border-radius': '80px 0 0 0',
      });
      return;
    }

    if (width <= 800) {
      setBannerVars({
        '--pos-banner-fluid-2__grid-template-columns': 'min-content 1fr',
        '--pos-banner-fluid-2__grid-template-rows': '100%',
        '--pos-banner-fluid-2__decor-grid-column': '2',
        '--pos-banner-fluid-2__decor-grid-row': '1',
        '--pos-banner-fluid-2__decor-padding': '30px 30px 30px 0',
        '--pos-banner-fluid-2__content-padding': '30px',
        '--pos-banner-fluid-2__bg-url': BG_SMALL,
        '--pos-banner-fluid-2__bg-position': '0% calc(100% - 6px)',
        '--pos-banner-fluid-2__bg-size': 'cover',
        '--pos-banner-fluid-2__slogan-font-size': '24px',
        '--pos-banner-fluid-2__slogan-line-height': '32px',
        '--pos-banner-fluid-2__logo-wrap-padding': '30px 30px 24px 40px',
        '--pos-banner-fluid-2__logo-wrap-top': 'initial',
        '--pos-banner-fluid-2__logo-wrap-bottom': '0',
        '--pos-banner-fluid-2__logo-wrap-border-radius': '80px 0 0 0',
      });
      return;
    }

    setBannerVars({
      '--pos-banner-fluid-2__grid-template-columns': 'min-content 1fr',
      '--pos-banner-fluid-2__grid-template-rows': '100%',
      '--pos-banner-fluid-2__decor-grid-column': '2',
      '--pos-banner-fluid-2__decor-grid-row': '1',
      '--pos-banner-fluid-2__decor-padding': '30px 30px 30px 0',
      '--pos-banner-fluid-2__content-padding': '30px',
      '--pos-banner-fluid-2__bg-url': BG_LARGE,
      '--pos-banner-fluid-2__bg-position': '0% center',
      '--pos-banner-fluid-2__bg-size': 'cover',
      '--pos-banner-fluid-2__slogan-font-size': '24px',
      '--pos-banner-fluid-2__slogan-line-height': '32px',
      '--pos-banner-fluid-2__logo-wrap-padding': '30px 30px 24px 40px',
      '--pos-banner-fluid-2__logo-wrap-top': 'initial',
      '--pos-banner-fluid-2__logo-wrap-bottom': '0',
      '--pos-banner-fluid-2__logo-wrap-border-radius': '80px 0 0 0',
    });
  }, []);

  useEffect(() => {
    updateBannerSize();
    window.addEventListener('resize', updateBannerSize);
    return () => window.removeEventListener('resize', updateBannerSize);
  }, [updateBannerSize]);

  const initWidget = () => {
    window.Widget?.(WIDGET_URL, widgetId);
  };

  return (
    <>
      <Script
        src={SCRIPT_SRC}
        strategy="lazyOnload"
        onReady={initWidget}
      />

      <div
        id="js-show-iframe-wrapper"
        ref={bannerRef}
      >
        <div className="pos-banner-fluid bf-2">
          <div className="bf-2__decor">
            <div className="bf-2__logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="bf-2__logo"
                src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo.svg"
                alt="Госуслуги"
              />
              <div className="bf-2__slogan">Решаем вместе</div>
            </div>
          </div>

          <div className="bf-2__content">
            <div className="bf-2__description">
              <span className="bf-2__text">
                Не убран мусор, яма на дороге, не горит фонарь?
              </span>
              <span className="pos-banner-fluid__text pos-banner-fluid__text_small">
                Столкнулись с проблемой — сообщите о ней!
              </span>
            </div>

            <div className="bf-2__btn-wrap">
              {/* pos-banner-btn_2 не удалять; другие классы не добавлять */}
              <button
                className="pos-banner-btn_2"
                type="button"
                style={{ width: 240 }}
              >
                Сообщить о проблеме
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
