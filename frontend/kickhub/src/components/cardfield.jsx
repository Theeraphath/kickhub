import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from "../../public/field.jpg";
import './cardfield.css';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function ImgMediaCard(props) {
  return (
    <div className="card">
       <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={Image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          สนาม
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <p>Status</p>
          <p>price</p>
          <div>
              <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button>ที่จอดรถ</Button>
        <Button>ห้องน้ำ</Button>
        <Button>ห้องอาบน้ำ</Button>
      </ButtonGroup>
          </div>
          <div>
            <div>
               
            </div>
            <div>

            </div>
          </div>

        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">ว่าง</Button>
        <Button size="small">ดูรายละเอียด</Button>
      </CardActions>
    </Card>
    </div>
    
  );
}
