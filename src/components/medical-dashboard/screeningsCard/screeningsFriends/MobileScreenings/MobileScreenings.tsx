import React from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { CarouselArrow } from '@app/components/common/BaseCarousel/CarouselArrow/CarouselArrow';
import { ScreeningsProps } from '../interfaces';
import * as S from './MobileScreenings.styles';
import { BREAKPOINTS } from '@app/styles/themes/constants';

export const MobileScreenings: React.FC<ScreeningsProps> = ({ screeningsItems }) => {
  return (
    <S.ScreeningsCarousel
      centerMode={false}
      infinite={false}
      arrows
      prevArrow={
        <CarouselArrow>
          <ArrowLeftOutlined rev={undefined} />
        </CarouselArrow>
      }
      nextArrow={
        <CarouselArrow>
          <ArrowRightOutlined rev={undefined} />
        </CarouselArrow>
      }
      slidesToShow={6}
      responsive={[
        {
          breakpoint: BREAKPOINTS.sm,
          settings: {
            slidesToShow: 5,
          },
        },
      ]}
    >
      {screeningsItems}
    </S.ScreeningsCarousel>
  );
};
