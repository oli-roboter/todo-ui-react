/* eslint-disable no-return-await */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import {
  grey, green, amber, red,
} from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Brightness1RoundedIcon from '@material-ui/icons/Brightness1Rounded';
import ScheduleIcon from '@material-ui/icons/Schedule';
import FlagIcon from '@material-ui/icons/Flag';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ModalWithFade from '../../../../components/Modal';
import EditTodoForm from '../todo-modal/EditTodoForm';
import ActionMenu from './ActionMenu';
import { useTodoState } from '../../todo-context';

const hoverGrey = grey[100];

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
    width: 250,
    flexShrink: 0,
    '&:hover': {
      background: hoverGrey,
      cursor: 'pointer',
    },
  },
  shaky: {
    margin: theme.spacing(0.5),
    width: 250,
    flexShrink: 0,
    animation: '$shake 500ms infinite',
    boxShadow: theme.shadows[5],
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  dot: {
    margin: theme.spacing(0),
    padding: theme.spacing(0.5),
  },
  flex_jcC_aiC: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flex_jcSB_aiC: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginRight: theme.spacing(1),
  },
  nameAndDate: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  deleteIcon: {
    color: grey[500],
    '&:hover': {
      background: hoverGrey,
      color: red[600],
      cursor: 'pointer',
    },
  },
  clockIcon: {
    marginRight: theme.spacing(0.5),
  },
  clockBox: {
    backgroundColor: grey[100],
    borderRadius: '5px',
    padding: theme.spacing(0.5, 1),
  },
  '@keyframes shake': {
    '0%': { transform: 'rotate(0deg)' },
    '10%': { transform: 'rotate(-1deg)' },
    '20%': { transform: 'rotate(0deg)' },
    '30%': { transform: 'rotate(1deg)' },
    '40%': { transform: 'rotate(0deg)' },
    '50%': { transform: 'rotate(-1deg)' },
    '60%': { transform: 'rotate(0deg)' },
    '70%': { transform: 'rotate(1deg)' },
    '80%': { transform: 'rotate(0deg)' },
    '90%': { transform: 'rotate(-1deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
}));

export default function SimpleCard({ colour, todo }) {
  const classes = useStyles();
  const { deleteMode, removeTodo, updateTodo } = useTodoState();
  const {
    todoId, text, detail, assignedTo, dueDate, importance,
  } = todo;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showTodo, setShowTodo] = React.useState(true);

  // on component unmount
  useEffect(() => () => setShowTodo(false), [todo.status]);

  const openCard = () => setOpen(true);
  const closeCard = () => setOpen(false);

  const openCardFromMenu = () => {
    setAnchorEl(null);
    setOpen(true);
  };

  const markAsCompleteFromMenu = async () => {
    setAnchorEl(null);
    await updateTodo({
      todoId,
      changes: {
        completedOn: new Date(),
        status: 'archived',
      },
    });
  };

  const deleteCard = async () => await removeTodo({ todoId });

  const clickFunctionality = () => (deleteMode ? null : openCard);

  const cardFormat = () => {
    if (deleteMode) return `${classes.shaky}`;
    return `${classes.root}`;
  };

  const flagColour = {
    High: red[600],
    Medium: amber[500],
    Low: green[500],
  };

  const getFlagColour = () => flagColour[importance];

  const handleRightClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {showTodo && (
        <>
          <Card
            className={cardFormat()}
            onClick={clickFunctionality()}
            onContextMenu={handleRightClick}
          >
            <CardContent>
              {deleteMode
                ? (
                  <div className={`${classes.flex_jcSB_aiC} ${classes.title}`}>
                    <Typography color="textSecondary">
                      {text}
                    </Typography>
                    <DeleteIcon className={classes.deleteIcon} onClick={deleteCard} />
                  </div>
                ) : (
                  <div className={`${classes.flex_jcSB_aiC} ${classes.title}`}>
                    <Typography color="textSecondary">
                      {text}
                    </Typography>
                    <FlagIcon style={{ color: getFlagColour() }} />
                  </div>
                )}

              <Typography variant="body2" component="p">
                {detail}
              </Typography>
            </CardContent>

            <div className={`${classes.flex_jcSB_aiC} ${classes.nameAndDate}`}>
              <div className={classes.flex_jcC_aiC}>
                <Brightness1RoundedIcon className={classes.dot} size="small" style={{ color: colour }} />
                <Typography className={classes.username} variant="body2">
                  {assignedTo}
                </Typography>
              </div>
              <div className={`${classes.flex_jcC_aiC} ${classes.clockBox}`}>
                <ScheduleIcon className={classes.clockIcon} />
                {moment(dueDate).format('D MMM')}
              </div>
            </div>
          </Card>

          <ModalWithFade
            open={open}
            onClose={closeCard}
          >
            <EditTodoForm todo={todo} onClose={closeCard} />
          </ModalWithFade>

          <ActionMenu
            anchorEl={anchorEl}
            handleClose={handleCloseMenu}
            openCard={openCardFromMenu}
            markAsComplete={markAsCompleteFromMenu}
          />
        </>
      )}
      {!showTodo === 'arechived' && null}
    </>
  );
}
