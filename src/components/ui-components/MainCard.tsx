import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import { CSSProperties, ReactNode, forwardRef } from "react";

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
}

interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: CSSProperties;
  darkTitle?: boolean;
  secondary?: ReactNode | string;
  shadow?: string;
  sx?: CSSProperties;
  title?: ReactNode | string;
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: '#1565c0',
          ':hover': {
            boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
          },
          ...sx
        }}
      >
        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
        {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant='h4'>{title}</Typography>} action={secondary} />}
        {title && <Divider />}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
);

export default MainCard;
