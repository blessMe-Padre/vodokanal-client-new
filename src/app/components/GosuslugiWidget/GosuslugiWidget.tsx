import './gosuslugi-widget.css';

import GosuslugiWidgetClient from './GosuslugiWidgetClient';

import type { GosuslugiWidgetProps } from './GosuslugiWidgetClient';

export default function GosuslugiWidget(props: GosuslugiWidgetProps) {
  return <GosuslugiWidgetClient {...props} />;
}
