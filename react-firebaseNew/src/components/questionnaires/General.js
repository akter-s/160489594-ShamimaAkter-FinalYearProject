import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { insertScore} from '../../actions/scoreAction';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
          width: 800,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
          display: 'block',
        margin: `${theme.spacing.unit}px 0`,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    alert: {
          color: 'red'
    }
})

const questionnaries = [
    {content: 'How often have you been bothered by missing coursework deadlines?'},
    {content: 'How often have you been bothered by trouble understanding the content of your degree?'},
    {content: 'How often have you been bothered by housing, bills and rent issues?'},
    {content: 'How often have you been bothered by struggling to contact your personal adviser?'},
    {content: 'How often have you been bothered by struggling to manage and save money?'},
    {content: 'How often have you been bothered by not knowing about extra financial support that is available?'}
  ];

class General extends Component {

    state = {
        scores: [1,1,1,1,1,1],
        loading: false,
        average_score: null
    };

    handleChange = index => (event) => {
        const score = parseInt(event.target.value);
        const scores = this.state.scores;
        scores[index] = score;
        this.setState({ scores: scores });
    };

    submitScore = event => {
        event.preventDefault();
        const scores = this.state.scores;
        var average_score = '';
        var total_score = 0;
        scores.map((value, key) => {
            total_score = total_score + value;
            return false;
        });
       // average_score = Math.round(total_score/6 * 100) / 100;
       average_score = total_score;
        this.props.insertScore(average_score);
        this.setState({loading: true, average_score: average_score})
    }
    render() {
        const { classes } = this.props;
        const { auth } = this.props;

        const loading = this.state.loading;
        const average_score = this.state.average_score;
        if (!auth.uid) return <Redirect to='/login' />
        return(
            <main className={classes.main}>
                <Typography variant="h4" className={classes.title}>
                    General
                </Typography>
                <Typography variant="h10" className={classes.title}>
                    [1 = never, 2 = rarely, 3 = sometimes, 4 = often, 5 = all the time]
                </Typography>
                {!average_score && loading ? <p> Please Wait...</p>: null}
                <div className={classes.alert}>
                   {average_score ? <p> Your Total Score: {average_score}</p> : null}
                </div>
                <List className={classes.root}>
                    {questionnaries.map((question, index) => 
                        <ListItem key={index} alignItems="flex-start; stretch">
                            <Typography>                 </Typography> {index+1}:
                            <ListItemText
                                primary={question.content}
                            />

                            <RadioGroup
                                        aria-label="Rating"
                                        name="rating"
                                        className={classes.group}
                                        onChange={this.handleChange(index)}
                                    >
                                <FormControlLabel value="1" control={<Radio />} label="1" />
                                <FormControlLabel value="2" control={<Radio />} label="2" />
                                <FormControlLabel value="3" control={<Radio />} label="3" />
                                <FormControlLabel value="4" control={<Radio />} label="4" />
                                <FormControlLabel value="5" control={<Radio />} label="5" />
                            </RadioGroup>
                        </ListItem>
                    )}
                </List>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={this.submitScore}
                    >
                    Submit
                </Button>
            </main>
        );
    }
}

const mapStateToProps = (state) => {
    return{
      auth: state.firebase.auth,
      average_score: state.score.average_score
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        insertScore: (average_score) => dispatch(insertScore(average_score)),
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(General));


