<?php
declare(strict_types=1);

namespace Paste\Controller;

use Paste\Controller\AppController;

/**
 * Testwc Controller
 *
 * @method \Paste\Model\Entity\Testwc[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class TestwcController extends AppController
{
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index( $text )
    {
        $this->viewBuilder()->setLayout('Webcomponent.test');

        $this->set( 'text', $text );
    }
}
